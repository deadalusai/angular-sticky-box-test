# Fixed header

## Use `position: sticky`

**Pros**
- Automatically reserves space in document
- Supports dynamically changing content heights

**Cons**
- Overlaps with any other `position: sticky` content
  in the scrolling context
- No support in IE11


## Use `position: fixed`

**Pros**
- Current solution for `tg-sticky-box`

**Cons**
- Additionally requires padding to offset the visual
  area covered by the fixed content.
- Need to manually set the padding
  (does not support dynamic content well)
- Still fights with other `position: sticky` content


## Use `position: fixed` with fixed-height header

**Pros**
- Can set the page padding directly
- Can be manually accounted for by `position: sticky` content in
  the page, e.g. by using a SCSS variable:

      $FREND-HEADER-HEIGHT: 50px;

      // Later...
      .my-sticky-content {
          position: sticky;
          // Stick the element just below the header
          top: $FREND-HEADER-HEIGHT + 10px;
      }

**Cons**
- Requires a fixed-height header


# Sticky content in-line

## Use JavaScript

**Pros**
- You get to deal with JavaScript developers

**Cons**
- Requires constant re-calculation on scroll (expensive)
- Jank


## Use Portal

**Pros**
- Move content into an already-stuck container

**Cons**
- Moving content within the DOM requires careful thought
  + Accessibility problems? Weird to move content around.
- Reflows the document unless careful
  + Manually hold height within document?
  + Portal into existing "sticky" div?

## Use `position: sticky`

**Pros**
- No Accesibility concerns (content does not change position in DOM)

**Cons**
- No IE11 support
- Fights with sticky header (unless we're using a fixed-height header)


# Sticky footer content

## Use `position: sticky`

**Cons**
- No IE11 support


## Use `position: fixed`

**Pros**
- IE11 support

**Cons**
- Need to manually set body padding


# Recommendations

- Header
  + `position: fixed` with fixed height
  + No sticky header
  + Fixed content (no Portal)
  + For dynamic content (e.g. a page-width region dropdown), use a `position: absolute` container at the bottom of the header.

    This allows the dynamic content to "drop over" the content in
    the rest of the page, and importantly does not require 
    re-calculation of the height of the header.

- Content
  + `position: sticky` (if you're happy that it won't stick in IE)
  + `top: {header height}` (if using a sticky or fixed header)
  + Fixed content (no Portal)

- Footer
  + `position: sticky` (if you're happy that it won't stick in IE)
  + Portal content in

- Toast messages
  + `position: fixed` with high z-index
  + No need to add body padding!
  + Portal content in
  + Can overlap with existing footer

- Oddball solutions:
  + Seperate header scrolling from body scrolling