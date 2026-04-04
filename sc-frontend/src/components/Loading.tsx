import GradientText from "./GradientText";

interface LoadingProps {
  message?: string;
  imageUrl?: string;                             // 图片地址（URL 或 base64）
  ascii?: string;                               // 自定义 ASCII 像素图形
  animation?: "stretch" | "bounce" | "spin" | "heartbeat" | "none";
  gradient?: string;
  preset?: "dachshund" | "slime" | "heart" | "pixel";
  maxHeight?: number;                            // 图案最大高度（px）
  messageSize?: "sm" | "md" | "lg" | number;  // 文案大小，支持预设或数值(px)，默认 lg
}

// 像素图形预设
const PIXEL_PRESETS = {
  dachshund: `
  ∴∵∵∴
 ∸    ∸
∸      ∸
`,
  slime: `
  ╭─╮
 (˘ᴗ˘)
 ╰──╯
`,
  heart: `
  ██  ██
█████████
█████████
█████████
█████████
 ███████
  █████
   ███
    █
`,
  pixel: `
◉‿◉
`,
};

const ANIMATION_CLASSES = {
  stretch: "animate-dachshund-stretch",
  bounce: "animate-slime-bounce",
  spin: "animate-pixel-spin",
  heartbeat: "animate-heart-beat",
  none: "",
};

const DEFAULT_GRADIENT = "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #0000FF, #8000FF)";

const MESSAGE_SIZE_CLASSES = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export default function Loading({
  message = "Loading...",
  imageUrl = "/images/project_3.jpg",
  ascii,
  animation = "heartbeat",
  gradient,
  preset = "pixel",
  maxHeight = 90,
  messageSize = 30,
}: LoadingProps) {
  const currentAscii = ascii ?? PIXEL_PRESETS[preset] ?? PIXEL_PRESETS.pixel;
  const currentGradient = gradient ?? DEFAULT_GRADIENT;
  const currentAnimation = ANIMATION_CLASSES[animation] ?? ANIMATION_CLASSES.heartbeat;
  const imageStyle = maxHeight ? { maxHeight: `${maxHeight}px` } : {};

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* === 图片或像素图形 === */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="loading"
          className={`${currentAnimation} overflow-hidden`}
          style={imageStyle}
        />
      ) : (
        <pre
          className={`${currentAnimation} leading-none font-sans overflow-hidden`}
          style={imageStyle}
        >
          {currentAscii}
        </pre>
      )}

      <GradientText
        className={`mt-4 text-neutral-500 ${typeof messageSize === "string" ? MESSAGE_SIZE_CLASSES[messageSize] ?? "text-base" : ""}`}
        gradient={currentGradient}
        style={typeof messageSize === "number" ? { fontSize: `${messageSize}px` } : {}}
      >
        {message}
      </GradientText>
    </div>
  );
}
