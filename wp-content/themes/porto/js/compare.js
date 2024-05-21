// Compare Popup
( function( theme, $ ) {
    'use strict';
    theme = theme || {};
    if ( !js_porto_vars.compare_popup ) return;
    $.extend( theme, {
        comparePopup: {
            isCart: true,
            popupContainer: null,
            $el: null,
            initialize: function( $el ) {
                this.$el = $el;
                if ( $( '.after-loading-success-message.style-3' ).length == 0 ) {
                    $( 'body' ).append( '<div class="after-loading-success-message style-3 d-block"></div>' );
                    this.isCart = false;
                    this.popupContainer = $( '.after-loading-success-message.style-3' );
                }
                else {
                    this.popupContainer = $( '.after-loading-success-message.style-3' );
                    this.popupContainer.eq( 0 ).stop().show();
                }

                this.popupContainer.on( 'click', '.compare-close', function() {
                    var $obj = $( this ).closest( '.success-message-container' );
                    $obj.removeClass( 'active' );
                    setTimeout( function() {
                        $obj.slideUp( 300, function() {
                            $obj.remove();
                        } );
                    }, 350 );
                } );
                this.build();
                return this;
            },
            build: function() {
                var self = this;
                if ( js_porto_vars.compare_popup ) {
                    var self = this,
                        isWishlistTable = $( '.wishlist_table' ).length > 0 ? true : false,
                        $product = isWishlistTable ? self.$el.closest( 'tr' ) : self.$el.closest( '.product' ),
                        message = typeof js_porto_vars.compare_popup_title == 'string' ? js_porto_vars.compare_popup_title : '',
                        link = isWishlistTable ? $product.find( '.product-thumbnail a:first-child' ).attr( 'href' ) : ( $product.find( '.product-image>a:first-child' ).length > 0 ? $product.find( '.product-image>a:first-child' ).attr( 'href' ) : '#' ),
                        image = isWishlistTable ? $product.find( '.product-thumbnail img' ).attr( 'src' ) : ( $product.find( '.product-inner .product-image img' ).length > 0 ? $product.find( '.product-inner .product-image img' ).attr( 'src' ) : $product.find( '.product-images .owl-item.active .img-thumbnail img' ).attr( 'src' ) ),
                        price = isWishlistTable ? $product.find( '.product-price' ).html() : $product.find( '.price' ).html(),
                        title = isWishlistTable ? $product.find( '.product-name a' ).text() : ( $product.find( '.woocommerce-loop-product__title' ).length == 1 ? $product.find( '.woocommerce-loop-product__title' ).text() : $product.find( '.product_title' ).text() );

                    if ( !image && $product.find( '.product-image img' ).length ) {
                        image = $product.find( '.product-image img' ).attr( 'src' );
                        var _image = $product.find( '.product-images img' );
                        if ( $product.find( '.product-image' ).closest( '.product-nav' ) && _image.length ) {
                            image = _image.attr( 'src' );
                            if ( _image.attr( 'data-oi' ) ) {
                                image = _image.attr( 'data-oi' );
                            }
                        }
                    }
                    if ( !title && $product.find( '.product-image' ).length ) {
                        title = $product.find( '.product-image' ).data( 'title' );
                    }
                    var $content = $( '<div class="compare-msg success-message-container"><p class="compare-popup-title">' + message +
                        '</p><div class="msg-box mb-0"><div class="msg"><div class="product-name"><a href="' + link +
                        '"><h3 class="product-title font-weight-bold line-height-sm mb-1">' + title + '</h3></a></div>' + '<span class="price text-primary">'
                        + price + '</span></div><img src="' + image + '" alt="' + title + '"/></div><button class="compare-close mfp-close"></button></div>' );

                    self.popupContainer.prepend( $content );
                    setTimeout( function() {
                        $content.addClass( 'active' );
                    }, 150 );
                    setTimeout( function() { $content.find( '.compare-close' ).trigger( 'click' ); }, 4000 );
                }
                return self;
            }
        }
    } );
} ).apply( this, [window.theme, jQuery] );