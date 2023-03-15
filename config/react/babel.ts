const emotion = (options?: {
    sourceMap: boolean;
    autoLabel: "dev-only" | "always" | "never";
    labelFormat: "[local]" | "[filename]" | "[dirname]";
    cssPropOptimization: boolean;
}) => ["@emotion", options];

const babel = {
    plugins: [emotion()],
};

export { babel };
