<?php

add_action( 'wp_enqueue_scripts', 'basel_child_enqueue_styles', 1000 );

function basel_child_enqueue_styles() {
	if( basel_get_opt( 'minified_css' ) ) {
		wp_enqueue_style( 'basel-style', get_template_directory_uri() . '/style.min.css', array('bootstrap') );
	} else {
		wp_enqueue_style( 'basel-style', get_template_directory_uri() . '/style.css', array('bootstrap') );
	}
	
    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css', array('bootstrap') );
}