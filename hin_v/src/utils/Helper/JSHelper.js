//scroll to top
export function scroll_to_top(type) {
  window.scrollTo({
    top: 0,
    behavior: type,
    /* you can also use 'auto' behaviour
           in place of 'smooth' */
  });
}
