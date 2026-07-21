import fs from "node:fs";
import path from "node:path";
import type { GalleryAlbum } from "@/types/config";
import { galleryConfig } from "@/config/galleryConfig";
import { url } from "@/utils/url-utils";

function withBase(assetPath: string): string {
	if (!assetPath) return "";
	if (/^(https?:)?\/\//i.test(assetPath) || /^(data|blob):/i.test(assetPath)) {
		return assetPath;
	}
	const normalizedPath = assetPath.startsWith("/")
		? assetPath
		: `/${assetPath}`;
	const base = import.meta.env.BASE_URL || "/";
	if (base !== "/" && normalizedPath.startsWith(base)) {
		return normalizedPath;
	}
	return url(normalizedPath);
}

/**
 * 扫描相册目录中的所有图片文件
 */
export function scanAlbumPhotos(albumId: string): string[] {
	const dir = path.join(process.cwd(), "public", "gallery", albumId);
	if (!fs.existsSync(dir)) return [];
	const files = fs
		.readdirSync(dir)
		.filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
		.sort();
	// 将 cover.* 排到第一位
	const coverIdx = files.findIndex((f) => /^cover\./i.test(f));
	if (coverIdx > 0) {
		const [coverFile] = files.splice(coverIdx, 1);
		files.unshift(coverFile);
	}
	const localPhotos = files.map((f) => withBase(`/gallery/${albumId}/${f}`));

	// 读取 urls.txt 中的远程图片 URL
	const urlsFile = path.join(dir, "urls.txt");
	let remotePhotos: string[] = [];
	if (fs.existsSync(urlsFile)) {
		remotePhotos = fs
			.readFileSync(urlsFile, "utf-8")
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith("#"));
	}

	return [...localPhotos, ...remotePhotos];
}

/**
 * 获取相册封面图
 * 优先级：手动指定 > cover.* 文件 > 第一张图片
 */
export function getAlbumCover(album: GalleryAlbum, photos: string[]): string {
	if (album.cover) return withBase(album.cover);
	const coverFile = photos.find((p) => /\/cover\./i.test(p));
	return coverFile || photos[0] || "";
}

function normalizePublicFolder(folder: string): string {
	return folder.startsWith("/") ? folder : `/${folder}`;
}

function publicFolderToDiskPath(folder: string): string {
	const normalizedFolder = normalizePublicFolder(folder);
	return path.join(process.cwd(), "public", normalizedFolder.replace(/^\/+/, ""));
}

function formatAlbumNameFromId(id: string): string {
	return id
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function readAlbumJson(albumDir: string): Partial<GalleryAlbum> {
	const metadataPath = path.join(albumDir, "album.json");
	if (!fs.existsSync(metadataPath)) return {};
	try {
		return JSON.parse(fs.readFileSync(metadataPath, "utf-8")) as Partial<GalleryAlbum>;
	} catch (error) {
		console.warn(`读取相册元信息失败：${metadataPath}`, error);
		return {};
	}
}

function scanGalleryAlbums(): GalleryAlbum[] {
	const autoScan = galleryConfig.autoScan;
	if (!autoScan?.enable) return [];

	const folder = autoScan.folder || "/gallery";
	const diskFolder = publicFolderToDiskPath(folder);
	if (!fs.existsSync(diskFolder)) return [];

	return fs
		.readdirSync(diskFolder, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const albumDir = path.join(diskFolder, entry.name);
			const metadata = readAlbumJson(albumDir);
			const stat = fs.statSync(albumDir);
			const fallbackDate = stat.mtime.toISOString().slice(0, 10);
			return {
				id: entry.name,
				name: formatAlbumNameFromId(entry.name),
				description: "",
				date: fallbackDate,
				tags: [],
				...metadata,
			} satisfies GalleryAlbum;
		});
}

/**
 * 获取最终相册列表
 * 自动扫描 public/gallery 子文件夹，再用 galleryConfig.albums 的同 id 配置覆盖元信息。
 */
export function getGalleryAlbums(): GalleryAlbum[] {
	const scannedAlbums = scanGalleryAlbums();
	const manualAlbums = galleryConfig.albums || [];
	const albumMap = new Map<string, GalleryAlbum>();

	for (const album of scannedAlbums) {
		albumMap.set(album.id, album);
	}

	for (const album of manualAlbums) {
		const scanned = albumMap.get(album.id);
		albumMap.set(album.id, {
			...scanned,
			...album,
		});
	}

	return [...albumMap.values()].sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		if (dateA !== dateB) return dateB - dateA;
		return a.id.localeCompare(b.id, "zh-CN");
	});
}
