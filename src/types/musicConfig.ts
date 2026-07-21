// 音乐播放器配置
export type MusicPlayerConfig = {
	// 使用方式：'meting' 或 'local'
	mode?: "meting" | "local"; // "meting" 使用 Meting API，"local" 使用本地音乐列表

	// 默认音量 (0-1)
	volume?: number;

	// 是否进入网站后自动播放音乐
	autoPlay?: boolean;

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode?: "list" | "one" | "random";

	// 是否显示歌词
	showLyrics?: boolean;

	// 是否在导航栏显示音乐播放器
	showInNavbar?: boolean;

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar?: boolean;

	// Meting API 配置
	meting?: {
		// Meting API 地址
		api?: string;

		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server?: "netease" | "tencent" | "kugou" | "xiami" | "baidu";

		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type?: "song" | "playlist" | "album" | "search" | "artist";

		// 歌单/专辑/单曲 ID 或搜索关键词
		id?: string;

		// 认证 token（可选）
		auth?: string;

		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis?: string[];
	};

	// 本地音乐配置（当 mode 为 'local' 时使用）
	local?: {
		// 自动扫描 public 里的音乐文件夹
		autoScan?: {
			// 是否启用自动扫描
			enable?: boolean;
			// 要扫描的公开目录，例如 "/assets/music/auto"
			folder?: string;
			// 封面目录，默认使用 `${folder}/cover`
			coverFolder?: string;
			// 歌词目录，默认使用 `${folder}/lrc`
			lrcFolder?: string;
		};

		// 手动音乐列表；启用 autoScan 时，这里可以留空，也可以继续手动补充特殊歌曲
		playlist?: Array<{
			name: string; // 歌曲名称
			artist: string; // 艺术家
			url: string; // 音乐文件路径（相对于 public 目录）
			cover?: string; // 封面图片路径（相对于 public 目录）
			lrc?: string; // 歌词内容，支持 LRC 格式
		}>;
	};
};
