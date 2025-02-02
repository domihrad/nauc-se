var { src, dest, watch, series } = require("gulp"),
    sass = require("gulp-sass")(require("sass")),
    autoprefixer = require("gulp-autoprefixer"),
    cssnano = require("gulp-cssnano"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat");


const scss = () =>
{
    return src("src/assets/styles/scss/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer("last 2 version"))
        .pipe(concat("main.css"))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest("src/assets/styles"));
}
const styles = () =>
{
    return src(["src/assets/styles/main.min.css"])
        .pipe(concat("main.css"))
        .pipe(rename({suffix: ".min"}))
        .pipe(cssnano())
        .pipe(dest("src/www/dist/css"));
}

const watchTask = () =>
{
    watch("src/assets/styles/scss/**/*.scss", scss);
    watch("src/assets/styles/", styles);
}

exports.default = series
(
    scss,
    styles,
    watchTask,
);