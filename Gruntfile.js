/* global module */
module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            dist: ['dist'],
            cleanOther: ['dist/wrap.js']
        },
        uglify: {
            build: {
                files: [{
                    'dist/report-js.min.js': ["dist/report-js.js"]
                }, {
                    'dist/report-tryjs.min.js': ["dist/report-tryjs.js"]
                }, {
                    'dist/reportJs.min.js': ["dist/reportJs.js"]
                },]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.js'],
                    dest: 'dist/'
                }]
            }
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.css'],
                    dest: 'dist/'
                }]
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/report-js.js', 'src/wrap.js'],
                dest: 'dist/report-tryjs.js'

            }
        },
        mocha: {
            all: {
                src: 'test/index.html',
                run: false
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // alias task
    grunt.registerTask('default', ['dev']);
    grunt.registerTask('dist', ['build']);
    grunt.registerTask('release', ['build']);

    // task
    grunt.registerTask('clear', ['clean']);
    grunt.registerTask('test', ['jshint', 'mocha']);
    grunt.registerTask('dev', ['clean:dev', 'jshint', 'uglify']);
    grunt.registerTask('build', ['clean:dist', 'copy:dist', 'concat:dist', 'clean:cleanOther', 'uglify']);

};
