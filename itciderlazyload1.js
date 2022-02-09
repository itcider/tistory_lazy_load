document.addEventListener("DOMContentLoaded", () => {
    let TICKING = false;

    const loadImg = (img) => {
        if (img.classList.contains("loaded")) return;

        img.src = img.dataset.src;
        img.removeAttribute("data-src");

        if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute("data-srcset");
        }

        img.classList.add("loaded");
    };

    const removeImgSrc = (img) => {
        img.dataset.src = img.src;

        if (img.dataset.srcset) {
            img.dataset.srcset = img.srcset;
            img.removeAttribute("srcset");
        }

        img.src = "https://cdn.jsdelivr.net/gh/itcider/tistory_lazy_load/itcider1x1.png";
    };

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const target = entry.target;

                    loadImg(target);

                    observer.unobserve(target);
                });
            },
            {
                root: null,
                rootMargin: "200px",
            }
        );

        document.querySelectorAll(".imageblock img,.imagegridblock img").forEach((img) => {
            removeImgSrc(img);
            io.observe(img);
        });
    } else {
        const scrollEvent = () => {
            const { scrollY } = window;

            document.querySelectorAll(".imageblock img,.imagegridblock img").forEach((img) => {
                if (img.classList.contains("loaded")) return;

                const offsetTop = img.parentNode.offsetTop;

                if (
                    offsetTop + img.offsetHeight > scrollY &&
                    scrollY + window.innerHeight > offsetTop
                ) {
                    loadImg(img);
                }
            });
        };

        document.querySelectorAll(".imageblock img,.imagegridblock img").forEach((img) => {
            removeImgSrc(img);

            scrollEvent();

            window.addEventListener(
                "scroll",
                () => {
                    TICKING ||
                        (window.requestAnimationFrame(() => {
                            loadImg();
                            TICKING = false;
                        }),
                        (TICKING = true));
                },
                { passive: true }
            );
        });
    }
});
