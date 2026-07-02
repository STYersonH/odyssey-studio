import {
	useEffect,
	useMemo,
	useRef,
	type CSSProperties,
	type HTMLAttributes,
} from "react";
import { createNeatGradient } from "./gradientEngine";
import { apricotStorm } from "./presets";

export type NeatGradientPreset = typeof apricotStorm;

export interface NeatBackgroundProps extends HTMLAttributes<HTMLDivElement> {
	preset?: NeatGradientPreset;
	colors?: string[];
	speed?: number;
	horizontalPressure?: number;
	verticalPressure?: number;
	colorBlending?: number;
	colorSaturation?: number;
	colorBrightness?: number;
	shadows?: number;
	highlights?: number;
	backgroundColor?: string;
	yOffset?: number;
	resolution?: number;
	className?: string;
	style?: CSSProperties;
}

/**
 * Reusable animated WebGL gradient background (Prussian / flat-shading plane type).
 */
function NeatBackground({
	preset = apricotStorm,
	colors,
	speed,
	horizontalPressure,
	verticalPressure,
	colorBlending,
	colorSaturation,
	colorBrightness,
	shadows,
	highlights,
	backgroundColor,
	yOffset,
	resolution,
	className = "",
	style,
	...rest
}: NeatBackgroundProps) {
	const hostRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<{
		setConfig: (next: Partial<NeatGradientPreset>) => void;
		destroy: () => void;
	} | null>(null);
	const configRef = useRef<NeatGradientPreset | null>(null);

	const config = useMemo(() => {
		const overrides = {
			colors,
			speed,
			horizontalPressure,
			verticalPressure,
			colorBlending,
			colorSaturation,
			colorBrightness,
			shadows,
			highlights,
			backgroundColor,
			yOffset,
			resolution,
		};
		const merged = { ...preset };
		for (const key in overrides) {
			const value = overrides[key as keyof typeof overrides];
			if (value !== undefined) {
				(merged as Record<string, unknown>)[key] = value;
			}
		}
		return merged;
	}, [
		preset,
		colors,
		speed,
		horizontalPressure,
		verticalPressure,
		colorBlending,
		colorSaturation,
		colorBrightness,
		shadows,
		highlights,
		backgroundColor,
		yOffset,
		resolution,
	]);

	configRef.current = config;

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return undefined;

		const canvas = document.createElement("canvas");
		canvas.setAttribute("aria-hidden", "true");
		canvas.style.display = "block";
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		host.appendChild(canvas);

		let engine: {
			setConfig: (next: Partial<NeatGradientPreset>) => void;
			destroy: () => void;
		} | null = null;
		let cancelled = false;
		let rafId = 0;

		const init = async () => {
			if (cancelled) return;
			if (host.clientWidth < 1 || host.clientHeight < 1) {
				rafId = requestAnimationFrame(() => {
					void init();
				});
				return;
			}

			try {
				engine = createNeatGradient({ canvas, ...configRef.current! });
			} catch (err) {
				console.warn(
					"[NeatBackground] Custom WebGL failed, using @firecms/neat:",
					err,
				);
				const { createFirecmsGradient } = await import("./firecmsAdapter");
				engine = await createFirecmsGradient({ canvas, ...configRef.current! });
			}

			if (!cancelled) engineRef.current = engine;
			else engine?.destroy();
		};

		void init();

		return () => {
			cancelled = true;
			cancelAnimationFrame(rafId);
			engine?.destroy();
			engineRef.current = null;
			canvas.remove();
		};
	}, []);

	useEffect(() => {
		engineRef.current?.setConfig(config);
	}, [config]);

	return (
		<div
			ref={hostRef}
			className={className}
			style={{ display: "block", width: "100%", height: "100%", ...style }}
			{...rest}
		/>
	);
}

export default NeatBackground;
