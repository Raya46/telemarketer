import { useState, useEffect, useRef, useCallback } from "react";
import {
  createClient,
  LiveClient,
  LiveTranscriptionEvents,
} from "@deepgram/sdk";

export const useDeepgramTranscription = () => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");

  const connectionRef = useRef<LiveClient | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onTranscriptReadyRef = useRef<(text: string) => void>(() => {});

  const startKeepAlive = useCallback(() => {
    keepAliveIntervalRef.current = setInterval(() => {
      if (
        connectionRef.current &&
        connectionRef.current.getReadyState() === 1
      ) {
        connectionRef.current.send(JSON.stringify({ type: "KeepAlive" }));
      }
    }, 10000);
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (isListening || connectionStatus === "connecting") return;

    try {
      setConnectionStatus("connecting");

      const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

      const connection = deepgram.listen.live({
        model: "nova-2",
        language: "id",
        smart_format: true,
        interim_results: true,
        endpointing: 300,
        utterance_end_ms: 1000,
        vad_events: true,
        punctuate: true,
        profanity_filter: false,
        redact: false,
        diarize: false,
        multichannel: false,
        alternatives: 1,
        numerals: false,
        search: [],
        replace: [],
        keywords: [],
      });

      connectionRef.current = connection;

      connection.on(LiveTranscriptionEvents.Open, async () => {
        console.log("Deepgram connection opened");
        setConnectionStatus("connected");
        setIsListening(true);
        startKeepAlive();

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });

          streamRef.current = stream;

          if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            mediaRecorderRef.current = new MediaRecorder(stream, {
              mimeType: "audio/webm;codecs=opus",
              audioBitsPerSecond: 16000,
            });
          } else {
            mediaRecorderRef.current = new MediaRecorder(stream);
          }

          mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0 && connection.getReadyState() === 1) {
              connection.send(event.data);
            }
          };

          mediaRecorderRef.current.start(100);
        } catch (audioError) {
          console.error("Error accessing microphone:", audioError);
          setConnectionStatus("error");
          setIsListening(false);
        }
      });

      connection.on(LiveTranscriptionEvents.Transcript, (data) => {
        const transcript = data.channel.alternatives[0]?.transcript;

        if (transcript && transcript.trim()) {
          if (data.is_final) {
            console.log("Final transcript:", transcript);
            setLiveTranscript("");

            if (finalTranscriptTimeoutRef.current) {
              clearTimeout(finalTranscriptTimeoutRef.current);
            }

            finalTranscriptTimeoutRef.current = setTimeout(() => {
              onTranscriptReadyRef.current(transcript);
            }, 100);
          } else {
            setLiveTranscript(transcript);
          }
        }
      });

      connection.on(LiveTranscriptionEvents.SpeechStarted, () => {
        console.log("Speech started");
      });

      connection.on(LiveTranscriptionEvents.UtteranceEnd, (data) => {
        console.log("Utterance ended:", data);
      });

      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log("Deepgram connection closed");
        setConnectionStatus("idle");
        setIsListening(false);
        stopKeepAlive();
        cleanup();
      });

      connection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram error:", error);
        setConnectionStatus("error");
        setIsListening(false);
        stopKeepAlive();
        cleanup();
      });
    } catch (error) {
      console.error("Could not start listening with Deepgram:", error);
      setConnectionStatus("error");
      setIsListening(false);
    }
  }, [isListening, connectionStatus, startKeepAlive, stopKeepAlive]);

  const cleanup = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (finalTranscriptTimeoutRef.current) {
      clearTimeout(finalTranscriptTimeoutRef.current);
      finalTranscriptTimeoutRef.current = null;
    }

    setLiveTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    stopKeepAlive();

    if (connectionRef.current) {
      try {
        if (connectionRef.current.getReadyState() === 1) {
          connectionRef.current.finish();
        }
      } catch (error) {
        console.error("Error finishing Deepgram connection:", error);
      }
      connectionRef.current = null;
    }

    cleanup();
    setIsListening(false);
    setConnectionStatus("idle");
  }, [cleanup, stopKeepAlive]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    liveTranscript,
    connectionStatus,
    startListening,
    stopListening,
    setOnTranscriptReady: (cb: (text: string) => void) => {
      onTranscriptReadyRef.current = cb;
    },
  };
};
