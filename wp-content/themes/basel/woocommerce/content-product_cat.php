<?php
/**
 * The template for displaying product category thumbnails within loops.
 *
 * Override this template by copying it to yourtheme/woocommerce/content-product_cat.php
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version 	2.6.1
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

global $woocommerce_loop, $basel_loop;

$isotope 		   = basel_get_opt( 'products_masonry' );
$different_sizes   = basel_get_opt( 'products_different_sizes' );
$categories_design = basel_get_opt( 'categories_design' );

// Store loop count we're currently on
// if ( empty( $woocommerce_loop['loop'] ) )
	// $woocommerce_loop['loop'] = 1;


// Store column count for displaying the grid
if ( empty( $woocommerce_loop['columns'] ) )
	$woocommerce_loop['columns'] = apply_filters( 'loop_shop_columns', 4 );


if ( ! empty( $woocommerce_loop['categories_design'] ) )
	$categories_design = $woocommerce_loop['categories_design'];

$style = '';

if ( ! empty( $woocommerce_loop['style'] ) )
	$style = $woocommerce_loop['style'];

// Increase loop count
// $woocommerce_loop['loop']++;

$different_sizes = false;

if( ! empty( $woocommerce_loop['different_sizes'] ) ) {
	$different_sizes = $woocommerce_loop['different_sizes'];
	$isotope = true;
}

// Store loop count we're currently on
if ( empty( $woocommerce_loop['loop'] ) ) {
	if( $different_sizes ) {
		$woocommerce_loop['loop'] = 1;
	} else {
		$woocommerce_loop['loop'] = 0;
	}
}

$items_wide = basel_get_wide_items_array( $different_sizes );
if( $different_sizes && ( in_array( $woocommerce_loop['loop'], $items_wide ) ) ) { 
	$basel_loop['double_size'] = true;
}
$classes = array();

if( $style != 'carousel' )
	$classes[] = basel_get_grid_el_class($woocommerce_loop['loop'], $woocommerce_loop['columns'], $different_sizes);

$classes[] = 'category-grid-item';
$classes[] = 'cat-design-' . $categories_design;

?>
<div <?php wc_product_cat_class($classes, $category); ?>>
	
	<div class="category-content">
		<a href="<?php echo esc_url( get_term_link( $category->slug, 'product_cat' ) ); ?>" class="category-link">
			<?php do_action( 'woocommerce_before_subcategory', $category ); ?>
			<div class="product-category-thumbnail">
				<?php
					/**
					 * woocommerce_before_subcategory_title hook
					 *
					 * @hooked basel_category_thumb_double_size - 10
					 */
					do_action( 'woocommerce_before_subcategory_title', $category );
				?>
			</div>
			<span class="products-cat-number">
				<?php echo sprintf( _n( '%s product', '%s products', $category->count, 'basel' ), $category->count ); ?>
			</span>
		</a>
		<div class="hover-mask">
			<a href="<?php echo esc_url( get_term_link( $category->slug, 'product_cat' ) ); ?>" class="category-link-overlay"></a>
			<h3>
				<?php
					echo esc_html( $category->name );
				?>
			</h3>

			<a href="<?php echo esc_url( get_term_link( $category->slug, 'product_cat' ) ); ?>"><?php _e('View products', 'basel'); ?></a>

			<?php
				/**
				 * woocommerce_after_subcategory_title hook
				 */
				do_action( 'woocommerce_after_subcategory_title', $category );
			?>
		</div>

		<?php do_action( 'woocommerce_after_subcategory', $category ); ?>
	</div>
</div>

<?php $basel_loop['double_size'] = false; ?>
<?php if( ! $isotope ) echo basel_get_grid_clear($woocommerce_loop['loop'], $woocommerce_loop['columns']); ?>