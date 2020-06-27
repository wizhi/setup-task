const path = require("path");
const fs = require("fs");
const core = require("@actions/core");
const github = require("@actions/github");
const tc = require("@actions/tool-cache");

const baseUrl = "https://github.com/go-task/task/releases/download";
const tool = "task";

const isWindows = platform => platform === "windows";

const getExecutableFileName = platform => isWindows(platform)
	? "task.exe"
	: "task";

(async () => {
	try {
		const version = core.getInput("version");
		const platform = ({
			"linux": "linux",
			"darwin": "darwin",
			"win32": "windows"
		})[process.platform];
		const arch = "amd64";
	
		if (!platform) {
			core.setFailed(`Unsupported platform '${process.platform}'`)
			return;
		}

		let toolPath = await tc.find(tool, version, arch);

		if (!toolPath) {
			toolPath = await download(version, platform, arch);
		}

		fs.chmodSync(path.join(toolPath, getExecutableFileName(platform)), '777');
		core.addPath(toolPath);
	} catch (error) {
		core.setFailed(error.message);
	}
})();
	
async function download(version, platform, arch) {
	const extension = isWindows(platform)
		? "zip"
		: "tar.gz";
	const url = `${baseUrl}/v${version}/task_${platform}_${arch}.${extension}`;
	const archivePath = await tc.downloadTool(url);
	const toolPath = isWindows(platform)
		? await tc.extractZip(archivePath)
		: await tc.extractTar(archivePath);

	return tc.cacheDir(toolPath, tool, version, arch);
}
