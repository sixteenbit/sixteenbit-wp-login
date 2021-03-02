<?php
/**
 * Plugin Name: Sixteenbit Login
 * Plugin URI: https://gitlab.com/sixteenbit/sixteenbit-login
 * Description: Custom styles for login screen.
 * Version: 1.0.0
 * Author: Sixteenbit
 * Author URI: https://sixteenbit.com
 * Text Domain: sixteenbit-wp-login
 */

/**
 * Enqueue custom login stylesheet/
 */
function sixteenbit_wp_login_stylesheet() {
	wp_enqueue_style( 'custom-login', plugins_url( '/assets/css/login.css', __FILE__ ) );
}

add_action( 'login_enqueue_scripts', 'sixteenbit_wp_login_stylesheet' );

/**
 * Replace WordPress in <title>
 *
 * @param $origtitle
 *
 * @return string
 */
function sixteenbit_wp_login_title( $origtitle ) {
	return esc_html( 'Login &lsaquo; ' ) . get_option( 'blogname' );
}

add_filter( 'login_title', 'sixteenbit_wp_login_title', 99 );

/**
 * Set logo url to home
 *
 * @return string|void
 */
function sixteenbit_wp_login_logo_url() {
	return home_url();
}

add_action( 'login_headerurl', 'sixteenbit_wp_login_logo_url' );

/**
 * Change Header Title to blogname
 *
 * @return false|mixed|void
 */
function sixteenbit_wp_login_headertitle() {
	return get_option( 'blogname' );
}

add_filter( 'login_headertext', 'sixteenbit_wp_login_headertitle' );

require 'updater/plugin-update-checker.php';

$loginUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
	'https://wordpress.sixteenbit.dev/updates/?action=get_metadata&slug=sixteenbit-wp-login', //Metadata URL.
	__FILE__, //Full path to the main plugin file.
	'sixteenbit-wp-login' //Plugin slug. Usually it's the same as the name of the directory.
);
