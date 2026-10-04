const ids = ["about", "music", "contact"];
const links = {};
document.querySelectorAll(".nav a.link").forEach((a) => {
	links[a.getAttribute("href").slice(1)] = a;
});

const LINE = 120; // hardcoded section length
let lockUntil = 0; // after a menu click, the clicked link stays marked while the page scrolls there
let ticking = false;

const mark = (id) =>
	ids.forEach((k) => {
		if (links[k]) links[k].classList.toggle("active", k === id);
	});

const update = () => {
	ticking = false;
	if (Date.now() < lockUntil) return;
	let current = null;
	ids.forEach((id) => {
		const el = document.getElementById(id);
		if (el && el.getBoundingClientRect().top <= LINE) current = id;
	});
	// mark the bottom-most one if you're at the bottom of the page
	if (
		window.innerHeight + window.scrollY >=
		document.documentElement.scrollHeight - 4
	)
		current = "contact";
	mark(current);
};
const onScroll = () => {
	if (!ticking) {
		ticking = true;
		requestAnimationFrame(update);
	}
};

// mark a menu link immediately when you click it, to avoid jumping to the wrong one while scrolling
Object.keys(links).forEach((id) => {
	links[id].addEventListener("click", () => {
		mark(id);
		lockUntil = Date.now() + 1100;
		setTimeout(update, 1150);
	});
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
update();
