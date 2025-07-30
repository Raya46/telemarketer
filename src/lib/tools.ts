export interface ToolParameters {
  type: 'object';
  properties: Record<string, {
    type: string;
    description: string;
  }>;
  required?: string[];
}

// Interface Tool utama yang akan digunakan di seluruh aplikasi
export interface Tool {
    type: 'function';
    name: string;
    description: string;
    parameters?: ToolParameters;
}

const toolDefinitions = {
    getCurrentTime: {
        description: 'Gets the current time in the user\'s timezone',
        parameters: {}
    },
    changeBackgroundColor: {
        description: 'Changes the background color of the page',
        parameters: {
        color: {
            type: 'string',
            description: 'Color value (hex, rgb, or color name)'
        }
        }
    },
    // ... sisa definisi tool Anda ...
    scrapeWebsite: {
        description: 'Scrapes a URL and returns content in markdown and HTML formats',
        parameters: {
            url: {
                type: 'string',
                description: 'The URL to scrape'
            }
        }
    }
} as const;

const tools: Tool[] = Object.entries(toolDefinitions).map(([name, config]) => ({
    type: "function",
    name,
    description: config.description,
    parameters: {
      type: 'object',
      properties: config.parameters
    }
}));

export { tools };