<?php
/**
 * Show options for ordering
 *
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<form class="woocommerce-ordering <?php if ( ! empty( $list ) ): ?>with-list<?php endif; ?>" method="get">
	<?php if ( ! empty( $list ) ): ?>
		<ul>
			<?php foreach ( $catalog_orderby_options as $id => $name ) : ?>
				<?php 

					$link = basel_shop_page_link( true );

					$link = add_query_arg( 'orderby', $id, $link );

				 ?>
				<li>
					<a href="<?php echo esc_url( $link ); ?>" data-order="<?php echo esc_attr( $id ); ?>" class="<?php if(selected( $orderby, $id, false ) ) echo 'selected-order'; ?>"><?php echo esc_html( $name ); ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php else: ?>
		<select name="orderby" class="orderby">
			<?php foreach ( $catalog_orderby_options as $id => $name ) : ?>
				<option value="<?php echo esc_attr( $id ); ?>" <?php selected( $orderby, $id ); ?>><?php echo esc_html( $name ); ?></option>
			<?php endforeach; ?>
		</select>
		<?php
			// Keep query string vars intact
			foreach ( $_GET as $key => $val ) {
				if ( 'orderby' === $key || 'submit' === $key ) {
					continue;
				}
				if ( is_array( $val ) ) {
					foreach( $val as $innerVal ) {
						echo '<input type="hidden" name="' . esc_attr( $key ) . '[]" value="' . esc_attr( $innerVal ) . '" />';
					}
				} else {
					echo '<input type="hidden" name="' . esc_attr( $key ) . '" value="' . esc_attr( $val ) . '" />';
				}
			}
		?>
	<?php endif ?>
</form>
