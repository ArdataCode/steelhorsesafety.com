<?php
/**
 * The sidebar containing the secondary widget area
 *
 * Displays on posts and pages.
 *
 * If no active widgets are in this sidebar, hide it completely.
 */

$sidebar_class = basel_get_sidebar_class();

$sidebar_name = basel_get_sidebar_name();

if( $sidebar_class == 'col-sm-0' )  return;

if ( is_active_sidebar( $sidebar_name ) ) : ?>
	<aside class="sidebar-container <?php echo esc_attr( $sidebar_class ); ?>" role="complementary">
		<div class="sidebar-inner">
			<div class="widget-area">
				<?php dynamic_sidebar( $sidebar_name ); ?>
			</div><!-- .widget-area -->
		</div><!-- .sidebar-inner -->
	</aside><!-- .sidebar-container -->
<?php endif; ?>