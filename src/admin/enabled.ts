/**
 * The admin panel and the content database behind it, on or off.
 *
 * Off while the site is still being reworked: every page is served from the
 * bundled content in src/content/seed, so a change made in the code shows at
 * once instead of being overridden by an older copy saved in the database,
 * and /admin answers "page not found". The enquiry forms are not affected;
 * they keep saving to the database.
 *
 * Set this to `true` to connect the two again. Nothing else needs to change.
 */
export const ADMIN_ENABLED: boolean = false;
