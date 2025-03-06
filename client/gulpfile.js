import gulp from "gulp";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cssnano from "gulp-cssnano";
import rename from "gulp-rename";
import concat from "gulp-concat";
import cache from "gulp-cache";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(dartSass);


const getImagemin = async () =>
{
    const imagemin = await import("gulp-imagemin");
    const mozjpeg = await import("imagemin-mozjpeg");
    const optipng = await import("imagemin-optipng");
    const gifsicle = await import("imagemin-gifsicle");
    const svgo = await import("imagemin-svgo");

    return {
        imagemin: imagemin.default,
        mozjpeg: mozjpeg.default,
        optipng: optipng.default,
        gifsicle: gifsicle.default,
        svgo: svgo.default
    };
};

const scss = () =>
{
    return src("src/assets/styles/scss/**/*.scss")
        .pipe(sass())
        .pipe(autoprefixer("last 2 version"))
        .pipe(concat("main.css"))
        .pipe(rename({suffix: ".min"}))
        .pipe(dest("src/assets/styles"));
};

const styles = () =>
{
    return src(["src/assets/styles/main.min.css"])
        .pipe(concat("main.css"))
        .pipe(rename({suffix: ".min"}))
        .pipe(cssnano())
        .pipe(dest("src/www/dist/css"));
};

const images = async () =>
{
    const { imagemin, mozjpeg, optipng, gifsicle, svgo } = await getImagemin();

    return src("src/assets/images/*.*")
        .pipe(cache(imagemin([
            mozjpeg({quality: 75, progressive: true}),
            optipng({optimizationLevel: 5}),
            gifsicle({interlaced: true}),
            svgo()
        ])))
        .pipe(dest("src/www/dist/assets/images"));
};

const watchTask = () =>
{
    watch("src/assets/styles/scss/**/*.scss", scss);
    watch("src/assets/styles/", styles);
    watch("src/assets/images/*", images);
};


export default series(
    scss,
    styles,
    images,
    watchTask
);
