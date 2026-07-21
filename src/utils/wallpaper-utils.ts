const supportedWallpaperFiles = {
	desktop: import.meta.glob(
		"../assets/images/DesktopWallpaper/*.{png,jpg,jpeg,webp,avif}",
	),
	mobile: import.meta.glob(
		"../assets/images/MobileWallpaper/*.{png,jpg,jpeg,webp,avif}",
	),
};

const naturalCollator = new Intl.Collator("zh-CN", {
	numeric: true,
	sensitivity: "base",
});

function normalizeAssetPath(filePath: string): string {
	const normalized = filePath.replace(/\\/g, "/");
	const assetsIndex = normalized.indexOf("assets/images/");
	return assetsIndex >= 0 ? normalized.slice(assetsIndex) : normalized;
}

function getWallpaperPaths(files: Record<string, unknown>): string[] {
	return Object.keys(files).map(normalizeAssetPath).sort(naturalCollator.compare);
}

export const autoDesktopWallpapers = getWallpaperPaths(
	supportedWallpaperFiles.desktop,
);

export const autoMobileWallpapers = getWallpaperPaths(
	supportedWallpaperFiles.mobile,
);
