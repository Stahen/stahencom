const items = Array.from(document.querySelectorAll(".track[data-src]"));
const audios = [];

const fmt = (s) => {
	if (!isFinite(s)) return "0:00";
	const m = Math.floor(s / 60),
		r = Math.floor(s % 60);
	return m + ":" + String(r).padStart(2, "0");
};

items.forEach((el, i) => {
	const audio = new Audio();
	audio.preload = "none";
	audio.src = `music/${el.dataset.src}`;
	audios.push(audio);

	const btn = el.querySelector(".play");
	const bar = el.querySelector(".bar");
	const fill = el.querySelector(".fill");
	const time = el.querySelector(".time");
	const tsub = el.querySelector(".tsub");
	const cover = el.querySelector(".cover");

	// only show the cover if the file exists
	if (cover && cover.dataset.cover) {
		const img = new Image();
		img.onload = () => {
			cover.style.setProperty(
				"--img",
				'url("/covers/' + cover.dataset.cover + '")',
			);
			cover.classList.add("has-cover");
		};
		img.src = `covers/${cover.dataset.cover}`;
	}

	const update = () => {
		const d = audio.duration;
		const p = isFinite(d) && d > 0 ? audio.currentTime / d : 0;
		fill.style.width = p * 100 + "%";
		bar.setAttribute("aria-valuenow", Math.round(p * 100));
		time.textContent = isFinite(d)
			? fmt(audio.currentTime) + " / " + fmt(d)
			: fmt(audio.currentTime);
	};

	const fail = () => {
		el.classList.add("unavailable");
		el.classList.remove("playing");
		if (tsub) tsub.textContent = "Audio file not found";
	};

	btn.addEventListener("click", () => {
		if (audio.paused) {
			audio.play().catch(fail);
		} else {
			audio.pause();
		}
	});

	audio.addEventListener("play", () => {
		audios.forEach((o) => {
			if (o !== audio) o.pause();
		});
		el.classList.add("playing");
		btn.setAttribute("aria-label", "Pause");
	});
	audio.addEventListener("pause", () => {
		el.classList.remove("playing");
		btn.setAttribute("aria-label", "Play");
	});
	audio.addEventListener("ended", () => {
		audio.currentTime = 0;
		update();
		const next = items[i + 1];
		if (next) next.querySelector(".play").click();
	});
	audio.addEventListener("timeupdate", update);
	audio.addEventListener("loadedmetadata", update);
	audio.addEventListener("error", fail);

	const seekTo = (p) => {
		if (isFinite(audio.duration))
			audio.currentTime = Math.min(Math.max(p, 0), 1) * audio.duration;
	};
	bar.addEventListener("click", (e) => {
		const r = bar.getBoundingClientRect();
		seekTo((e.clientX - r.left) / r.width);
	});
	bar.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") audio.currentTime += 5;
		if (e.key === "ArrowLeft") audio.currentTime -= 5;
	});
});
