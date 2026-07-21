import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
// 常改位置：
// 1. mode：meting 表示用网易云/QQ 音乐等歌单接口，local 表示使用本地音乐文件
// 2. volume：默认音量，0.2 就是 20%
// 3. autoPlay：打开网站后是否自动播放
// 4. local.autoScan：自动扫描音乐文件夹，音乐文件放在 public/assets/music/auto
// 5. local.playlist：手动本地音乐列表，需要特殊配置时再写
// 注意：如果使用本地音乐，url 和 cover 路径不要写 public，直接写 /assets/...
export const musicPlayerConfig: MusicPlayerConfig = {
	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 是否在侧边栏显示音乐播放器组件
	showInSidebar: true,

	// 使用方式："meting" 使用 Meting API，"local" 使用本地音乐列表
	mode: "local",

	// 默认音量 (0-1)
	volume: 0.2,

	// 是否进入网站后自动播放音乐
	autoPlay: true,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: true,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "10046455237",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置（当 mode 为 'local' 时使用）
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		// 自动扫描文件夹：以后把歌曲放到 public/assets/music/auto 即可自动加入歌单
		// 推荐文件名格式：歌名 - 歌手.mp3 / 歌名 - 歌手.flac
		autoScan: {
			enable: true,
			folder: "/assets/music/auto",
			coverFolder: "/assets/music/auto/cover",
			lrcFolder: "/assets/music/auto/lrc",
		},
		// 手动补充歌单：一般不用写，特殊歌曲才写在这里
		playlist: [],
	},
};
