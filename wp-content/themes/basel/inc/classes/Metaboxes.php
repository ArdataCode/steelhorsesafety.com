<?php if ( ! defined('BASEL_THEME_DIR')) exit('No direct script access allowed');

/**
 * Add metaboxesto pages and posts
 * uses CMB plugins
 * 
 */

/*
    to fix image uploads for taxonomies
    add to file CMB2hookup.php
    line 197
    if ( in_array( $hook, array( 'edit-tags.php', 'post.php', 'post-new.php', 'page-new.php', 'page.php' ), true ) ) {

 */
class BASEL_Metaboxes {
    /**
     * Options slug for Redux Framework
     * @var string
     */
	private $opt_name = "basel_options";


    /**
     * Add actions
     * 
     */
	public function __construct() {

		//add_action( 'init', array( $this, 'load_cmb_plugin' ), 199 );

        add_action( 'cmb2_init', array( $this, 'load_cmb_plugin' ), 199 );
        add_action( 'cmb2_init', array( $this, 'pages_metaboxes' ), 5000 );
        add_action( 'cmb2_init', array( $this, 'product_metaboxes' ), 6000 );
        add_action( 'cmb2_init', array( $this, 'product_categories' ), 7000 );
        add_action( 'cmb2_init', array( $this, 'posts_categories' ), 8000 );

        add_action("redux/metaboxes/{$this->opt_name}/boxes", array( $this, 'metaboxes' ) );
	}

    /**
     * Require CMB plugin files
     * 
     */
	public function load_cmb_plugin() {
        // Deprecated from BASEL 3.0
		if ( ! basel_new_meta() && function_exists( 'new_cmb2_box' ) ) {
			require_once( apply_filters('basel_require', BASEL_3D . '/Taxonomy_MetaData/Taxonomy_MetaData_CMB2.php' ) );
		}
	}

    /**
     * Register all custom metaboxes with CMB2 API
     */
    public function pages_metaboxes() {
        global $basel_transfer_options, $basel_prefix;

        // Start with an underscore to hide fields from custom fields list
        $basel_prefix = '_basel_';
        
        $basel_metaboxes = new_cmb2_box( array(
            // 'cmb_styles' => false, // false to disable the CMB stylesheet
            // 'closed'     => true, // true to keep the metabox closed by default
            'id' => 'page_metabox',
            'title' => 'Page Setting (custom metabox from theme)',
            'object_types' => array('page', 'post', 'portfolio'), // post type
            'context' => 'normal',
            'priority' => 'high',
            'show_names' => true, // Show field names on the left
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => 'Custom sidebar for this page',
            'id'      => $basel_prefix . 'custom_sidebar',
            'type'    => 'select',
            'options' => basel_get_sidebars_array()
        ) );

        $basel_transfer_options = array( 
            'main_layout',
            'sidebar_width',
            'header',
            'header-overlap',
            'header_color_scheme',
            'page-title-size',
        );

        foreach ($basel_transfer_options as $field) {
            $cmb_field = $this->redux2cmb_field( $field );
            $basel_metaboxes->add_field( $cmb_field );
        }

        $basel_metaboxes->add_field( array(
            'name'    => 'Disable Page title',
            'desc'    => 'You can hide page heading for this page',
            'id'      => $basel_prefix . 'title_off',
            'type'    => 'checkbox',
        ) );

        $basel_metaboxes->add_field( array(
            'name' => 'Image for page heading',
            'desc' => 'Upload an image',
            'id' => $basel_prefix . 'title_image',
            'type' => 'file',
            'allow' => array( 'url', 'attachment' ) // limit to just attachments with array( 'attachment' )
        ) );


        $basel_metaboxes->add_field( array(
            'name' => 'Page heading background color',
            'desc' => 'Upload an image',
            'id' => $basel_prefix . 'title_bg_color',
            'type' => 'colorpicker',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => 'Text color for heading',
            'id'      => $basel_prefix . 'title_color',
            'type'    => 'radio_inline',
            'options' => array(
                'default' => __( 'Inherit', 'basel' ),
                'light' => 'Light', 
                'dark' => 'Dark',
            ),
            'default' => 'default'
        ) );


        $basel_metaboxes->add_field( array(
            'name'    => 'Open categories menu',
            'desc'    => 'Always shows categories navigation on this page',
            'id'      => $basel_prefix . 'open_categories',
            'type'    => 'checkbox',
        ) );
    }

    /**
     * Metaboxes for products
     */
    public function product_metaboxes() {
        global $basel_prefix, $basel_transfer_options;

        // Start with an underscore to hide fields from custom fields list
        $basel_prefix = '_basel_';
        $taxonomies_list = array( '' => 'Select' );
        $taxonomies = get_taxonomies(); 
        foreach ( $taxonomies as $taxonomy ) {
            $taxonomies_list[$taxonomy] = $taxonomy;
        }

        $basel_metaboxes = new_cmb2_box( array(
            // 'cmb_styles' => false, // false to disable the CMB stylesheet
            // 'closed'     => true, // true to keep the metabox closed by default
            'id' => 'product_metabox',
            'title' => 'Product Setting (custom metabox from theme)',
            'object_types' => array('product'), // post type
            'context' => 'normal',
            'priority' => 'high',
            'show_names' => true, // Show field names on the left
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => esc_html__('Add "New" label', 'basel'), 
            'desc'    => 'You can add "New" label to this product',
            'id'      => $basel_prefix . 'new_label',
            'type'    => 'checkbox',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => 'Hide related products',
            'desc'    => 'You can hide related products on this page',
            'id'      => $basel_prefix . 'related_off',
            'type'    => 'checkbox',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => __('Hide tabs headings', 'basel'), 
            'desc'    => 'Description and Additional information',
            'id'      => $basel_prefix . 'hide_tabs_titles',
            'type'    => 'checkbox',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => __('Grid swatch attribute to display', 'basel'), 
            'desc' => __('Choose attribute that will be shown on products grid for this particular product', 'basel'),
            'id'      => $basel_prefix . 'swatches_attribute',
            'type'    => 'select',
            'options' => $taxonomies_list
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => __('Product video URL', 'basel'), 
            'desc'    => 'Vimeo or YouTube video url. For example: https://www.youtube.com/watch?v=1zPYW6Ipgok',
            'id'      => $basel_prefix . 'product_video',
            'type'    => 'text',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => __('Instagram product hashtag', 'basel'), 
            'desc'    => 'Insert tag that will be used to display images from instagram from your customers. For example: <strong>#nike_rush_run</strong>',
            'id'      => $basel_prefix . 'product_hashtag',
            'type'    => 'text',
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => __('Product background', 'basel'), 
            'id'      => $basel_prefix . 'product-background',
            'type'    => 'colorpicker',
        ) );

        $basel_local_transfer_options = array( 
            'single_product_style',
            'product_design',
            'main_layout',
            'sidebar_width',
        );

        foreach ($basel_local_transfer_options as $field) {
            $cmb_field = $this->redux2cmb_field( $field );
            $basel_metaboxes->add_field( $cmb_field );
        }

        $basel_metaboxes->add_field( array(
            'name'    => 'Custom sidebar for this product',
            'id'      => $basel_prefix . 'custom_sidebar',
            'type'    => 'select',
            'options' => basel_get_sidebars_array()
        ) );

        $blocks = array_flip(basel_get_static_blocks_array());

        $blocks = (array)'None' + $blocks;

        $basel_metaboxes->add_field( array(
            'name'    => 'Extra content block',
            'desc'    => 'You can create some extra content with Visual Composer (in Admin panel / HTML Blocks / Add new) and add it to this product',
            'id'      => $basel_prefix . 'extra_content',
            'type'    => 'select',
            'options' => $blocks
        ) );

        $basel_metaboxes->add_field( array(
            'name'    => 'Extra content position',
            'id'      => $basel_prefix . 'extra_position',
            'type'    => 'radio_inline',
            'options' => array(
                'after' => __( 'After content', 'basel' ),
                'before' => __( 'Before content', 'basel' ),
                'prefooter' => __( 'Prefooter', 'basel' ),
            ),
            'default' => 'after'
        ) );

        $basel_transfer_options = array_merge( $basel_transfer_options, $basel_local_transfer_options );
        
    }

    public function posts_categories() {

        $blog_design_field = $this->redux2cmb_field( 'blog_design' );

        $blog_design_field['name'] .= ' for this category';

        if( basel_new_meta() ) {
            $cmb_term = cmb2_get_metabox( array(
                'id'               => 'cat_options',
                'object_types'     => array( 'term' ), 
                'taxonomies'       => array( 'category' ), 
                'new_term_section' => true, // Will display in the "Add New Category" section
            ), basel_get_current_term_id(), 'term' );

            $cmb_term->add_field($blog_design_field);
        } else {
            $posts_cat_metaboxes = array(
                'id'         => 'cat_options',
                // 'key' and 'value' should be exactly as follows
                'show_on'    => array( 'key' => 'options-page', 'value' => array( 'unknown', ), ),
                'show_names' => true, // Show field names on the left
                'fields'     => array(
                    $blog_design_field
                )
            );

            /**
             * Instantiate our taxonomy meta class
             */
            $cats = new Taxonomy_MetaData_CMB2( 'category', $posts_cat_metaboxes, __( 'Category Settings', 'taxonomy-metadata' ) );     
        }

    }

    public function product_categories() {
        $field = array(
                    'name' => 'Image for category heading',
                    'desc' => 'Upload an image',
                    'id' => 'title_image',
                    'type' => 'file',
                    'allow' => array( 'url', 'attachment' ) // limit to just attachments with array( 'attachment' )
                );

        if( basel_new_meta() ) {
            $cmb_term = cmb2_get_metabox( array(
                'id'               => 'product_cat_options',
                'object_types'     => array( 'term' ), 
                'taxonomies'       => array( 'product_cat' ), 
                'new_term_section' => true, // Will display in the "Add New Category" section
            ), basel_get_current_term_id(), 'term' );

            $cmb_term->add_field($field);
        } else {
            $product_cat_metaboxes = array(
                'id'         => 'cat_options',
                // 'key' and 'value' should be exactly as follows
                'show_on'    => array( 'key' => 'options-page', 'value' => array( 'unknown', ), ),
                'show_names' => true, // Show field names on the left
                'fields'     => array(
                    $field
                )
            );

            /**
             * Instantiate our taxonomy meta class
             */
            $cats = new Taxonomy_MetaData_CMB2( 'product_cat', $product_cat_metaboxes, __( 'Category Settings', 'taxonomy-metadata' ) );  
        }

    }



    /**
     * Transfer function from redux to CMB2
     * @param  string $field      field slug in Redux options
     * @return array  $cmb_field  CMB compatible field config array
     */
	public function redux2cmb_field( $field ) {

        if( ! class_exists('Redux') ) return array(
            'id' => '',
            'type' => '',
            'name' => '',
            'options' => '',
            'default' => 'default'  ,
        );

		$prefix = '_basel_';

		$field = Redux::getField($this->opt_name, $field);

		$options = array();
		
		switch ($field['type']) {
			case 'image_select':
				$type = 'select';
				$options = ( ! empty( $field['options'] ) ) ? array_merge( array('default' => array('title' => 'Inherit') ), $field['options'] ) : array();
				foreach ($options as $key => $option) {
					$options[$key] = ( isset( $options[$key]['alt'] ) ) ? $options[$key]['alt'] : $options[$key]['title'];
				}
			break;

			case 'button_set':
				$type = 'radio_inline';
				$options['default'] = 'Inherit';
				foreach ($field['options'] as $key => $value) {
					$options[$key] = $value;
				}
			break;

            case 'select':
                $type = 'select';
                $options['inherit'] = 'Inherit';
                foreach ($field['options'] as $key => $value) {
                    $options[$key] = $value;
                }
            break;

            case 'switch':
                $type = 'checkbox';
            break;
			
			default:
				$type = $field['type'];
			break;
		}

		$cmb_field = array(
			'id' => $prefix . $field['id'],
			'type' => $type,
			'name' => $field['title'],
			'options' => $options,
		);

		return $cmb_field;
	}

    public function metaboxes($metaboxes) {
        // Declare your sections
        $boxSections = array();
        $boxSections[] = array(
            'title' => 'Performance',
            'id' => 'performance',
            'icon' => 'el-icon-cog',
            'fields' => array (
                array (         
                    'id'       => 'product-background',
                    'type'     => 'background',
                    'title'    => __('Product background', 'basel'),
                    'subtitle' => __('Set background for your products page. You can also specify different background for particular products while editing it.', 'basel'),
                    'output'   => array('.single-product-content')
                ),
            ),
        );
 
        // Declare your metaboxes
        $metaboxes = array();
        $metaboxes[] = array(
            'id'            => 'sidebar',
            'title'         => __( 'Sidebar', 'basel' ),
            'post_types'    => array( 'product' ),
            //'page_template' => array('page-test.php'), // Visibility of box based on page template selector
            //'post_format' => array('image'), // Visibility of box based on post format
            'position'      => 'normal', // normal, advanced, side
            'priority'      => 'high', // high, core, default, low - Priorities of placement
            'sections'      => $boxSections,
        );
 
        return $metaboxes;
    }

}