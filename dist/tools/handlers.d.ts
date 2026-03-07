type ToolResult = {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
};
export declare function handleToolCall(toolName: string, args: Record<string, unknown>): Promise<ToolResult>;
export {};
//# sourceMappingURL=handlers.d.ts.map