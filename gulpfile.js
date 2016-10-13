'use strict';

// Require
var gulp = require('gulp');    //载入gulp

var gulpLess = require('gulp-less');   //将less预处理为css
var uglify = require('gulp-uglify'); //压缩js文件
var minifyCss = require('gulp-minify-css');  //压缩css
var concat = require('gulp-concat'); //合并
var del = require('del'); //删除

var src = 'src/';
var dst = 'dist/';
var jsFile = 'zcharts.min.js';  //最后合并压缩成的js文件名
var cssFile = 'zcharts.min.css';  //最后合并压缩成的css文件名

gulp.task('cleanCss', function (cb) {   //定义名为cleanCss的任务——删除css
    return del(dst + '/*.css', cb);  //删除dist文件夹下的所有js文件
});

gulp.task('cleanJs', function (cb) {  //删除dist文件夹下的所有js文件
    return del(dst + '/*.js', cb);
});

gulp.task('concat-uglify-js', ['cleanJs'], function() {  //合并压缩js（首先删除js文件）
    return gulp.src(src + 'js/*.js')
        .pipe(concat(jsFile))  
        .pipe(uglify())   //通过UglifyJS来压缩JS文件
        .pipe(gulp.dest(dst)); //将经过插件处理的文件流通过pipe方法导入到gulp.dest()中
});

gulp.task('minify-css', ['cleanCss','less'], function() {  //压缩css（首先删除css文件，将less编译成css文件）
    return gulp.src(src + 'css/*.css')
        .pipe(concat(cssFile))    
        .pipe(minifyCss())  //压缩css
        .pipe(gulp.dest(dst)); 
});

gulp.task('less', function () {  //定义名为less的任务
    return gulp.src(src + 'less/*.less')
        .pipe(gulpLess())    //将less预处理为css
        .pipe(gulp.dest('src/css'));  //最后生成的文件路径为src/css/*.less
});

gulp.task('watch', function () {  //定义名为watchless的任务
    gulp.watch(src + 'less/*.less', ['minify-css']);   //监听该目录下less文件的变化
    gulp.watch(src + 'js/*.js', ['concat-uglify-js']);//监听该目录下js文件的变化
});

gulp.task('default', ['concat-uglify-js', 'minify-css']);  //定义名为default的任务，默认任务

