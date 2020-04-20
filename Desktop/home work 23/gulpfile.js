const gulp = require('gulp');
const gulpScss = require('gulp-sass');
const remove = require('gulp-remove-files');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();




gulp.task('browser-sync', ()=>{
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
})

gulp.task('build style',done => {
    gulp.src('./main.scss')
    .pipe(gulpScss())
    .pipe(gulp.dest('./src/dist'));
    done();
});

gulp.task('js', done => {
    gulp.src('./src/index.js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest('./src/dist'))
    done();
})

gulp.task('clean', done =>{
    gulp.src('./src/dist/*')
    .pipe(remove());
    done();
})

gulp.task('watch', () => {
    gulp.watch('./main.scss',gulp.series('build style'))
    gulp.watch('./src/index.js',gulp.series('js'))
})

gulp.task('default', gulp.series('clean','build style','js','browser-sync','watch'));
