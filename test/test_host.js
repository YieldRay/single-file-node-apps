import host from "../src/staticFileHosting.js";
host(
    [
        { public: "a.js", local: "./index.js" },
        { public: "/", local: "./public/" },
        {
            public: "/test/",
            local: "./test.js",
        },
    ],
    8888
);
