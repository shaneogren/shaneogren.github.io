// All 74 paintings, in the same order as shaneogren.com.
// Titles, years, media, and dimensions synced from the live Squarespace site (2026-07-09).
// Replace "checkout.html" with real Stripe Payment Link URLs when ready.

const PAINTINGS = [
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { title: "Remember We",               year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/remember-we.webp",               price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Excelsior Sings",           year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/excelsior-sings.webp",           price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Dropping Up",               year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/dropping-up.webp",               price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Adjacent All",              year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/adjacent-all.webp",              price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Burning Yields",            year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/burning-yields.webp",            price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Known Landing",             year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/known-landing.webp",             price: "$6,000",  stripeLink: "checkout.html" },
  // ── 2023 ──────────────────────────────────────────────────────────────────
  { title: "Private Pollution",         year: 2023, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/private-pfas.webp",              price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Cardinal Scout",            year: 2023, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/cardinal-scout.webp",            price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Light Lending",             year: 2023, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/light-lender.webp",              price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Under Sound",               year: 2023, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/under-sound.webp",               price: "$6,000",  stripeLink: "checkout.html" },
  { title: "And Still",                 year: 2023, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/now-what.webp",                  price: "$6,000",  stripeLink: "checkout.html" },
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { title: "Gone Together",             year: 2024, medium: "oil on wood",   dimensions: '9" × 9"',         image: "images/painting/forgetting-gone.webp",           price: "$6,000",  stripeLink: "checkout.html" },
  // ── 2023 ──────────────────────────────────────────────────────────────────
  { title: "Round Rest",                year: 2023, medium: "oil on canvas", dimensions: '17" × 21.5"',     image: "images/painting/round-rest.webp",                price: "$6,000",  stripeLink: "checkout.html" },
  // ── 2024 ──────────────────────────────────────────────────────────────────
  { title: "Mercy Frequency",           year: 2024, medium: "oil on canvas", dimensions: '13.75" × 17"',    image: "images/painting/mercy-frequency.webp",           price: "$9,000",  stripeLink: "checkout.html" },
  // ── 2023 ──────────────────────────────────────────────────────────────────
  { title: "Inner Move",                year: 2023, medium: "oil on canvas", dimensions: '13.75" × 17"',    image: "images/painting/grandma-green.webp",             price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Later Love",                year: 2023, medium: "oil on canvas", dimensions: '17" × 17"',       image: "images/painting/late-lunch.webp",                price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Dawn Now",                  year: 2023, medium: "oil on canvas", dimensions: '17" × 17"',       image: "images/painting/dawn-under.webp",                price: "$6,000",  stripeLink: "checkout.html" },
  { title: "Force Furling",             year: 2023, medium: "oil on canvas", dimensions: '17" × 17"',       image: "images/painting/force-furling.webp",             price: "$6,000",  stripeLink: "checkout.html" },
  // ── 2020 ──────────────────────────────────────────────────────────────────
  { title: "Mente",                     year: 2020, medium: "oil on wood",   dimensions: '18.25" × 14"',    image: "images/painting/proyecto-de-iluminacion.webp",   price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Por Fin",                   year: 2020, medium: "oil on wood",   dimensions: '18.25" × 14"',    image: "images/painting/por-fin.webp",                   price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Siempre",                   year: 2020, medium: "oil on wood",   dimensions: '18.25" × 14"',    image: "images/painting/una-vez-mas.webp",               price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Anomola",                   year: 2020, medium: "oil on wood",   dimensions: '18.25" × 14"',    image: "images/painting/untitled-1.webp",                price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Fundar",                    year: 2020, medium: "oil on wood",   dimensions: '18.25" × 14"',    image: "images/painting/fundar.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2019 ──────────────────────────────────────────────────────────────────
  { title: "Ama",                       year: 2019, medium: "oil on wood",   dimensions: '20.75" diameter', image: "images/painting/ma-1.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Doggle",                    year: 2019, medium: "oil on wood",   dimensions: '23.5" diameter',  image: "images/painting/che.webp",                       price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Ring",                      year: 2019, medium: "oil on wood",   dimensions: '13.75" diameter', image: "images/painting/ring.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Ruth",                      year: 2019, medium: "oil on wood",   dimensions: '17" diameter',    image: "images/painting/ruth.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Leften",                    year: 2019, medium: "oil on wood",   dimensions: '23.5" diameter',  image: "images/painting/left.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Bellows",                   year: 2019, medium: "oil on wood",   dimensions: '17" diameter',    image: "images/painting/eulogy.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2018 ──────────────────────────────────────────────────────────────────
  { title: "Inside",                    year: 2018, medium: "oil on wood",   dimensions: '6.75" diameter',  image: "images/painting/inside.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Lady",                      year: 2018, medium: "oil on wood",   dimensions: '13.75" diameter', image: "images/painting/lady.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Platos",                    year: 2018, medium: "oil on wood",   dimensions: '17" diameter',    image: "images/painting/platos.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2017 ──────────────────────────────────────────────────────────────────
  { title: "Injuries",                  year: 2017, medium: "oil on wood",   dimensions: '6.75" diameter',  image: "images/painting/multiple-injuries.webp",         price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Elsewhen",                  year: 2017, medium: "oil on wood",   dimensions: '10" diameter',    image: "images/painting/elsewhen.webp",                  price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Stories",                   year: 2017, medium: "oil on wood",   dimensions: '10.25" diameter', image: "images/painting/stories.webp",                   price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Lingerings",                year: 2017, medium: "oil on wood",   dimensions: '13.75" diameter', image: "images/painting/lingerings.webp",                price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Chance",                    year: 2017, medium: "oil on wood",   dimensions: '6.75" diameter',  image: "images/painting/dry-high.webp",                  price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Lip",                       year: 2017, medium: "oil on wood",   dimensions: '10.25" diameter', image: "images/painting/lip.webp",                       price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Liminal",                   year: 2017, medium: "oil on wood",   dimensions: '12" diameter',    image: "images/painting/doggedly.webp",                  price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2016 ──────────────────────────────────────────────────────────────────
  { title: "Ever",                      year: 2016, medium: "oil on wood",   dimensions: '10" diameter',    image: "images/painting/ever.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Hollow",                    year: 2016, medium: "oil on wood",   dimensions: '21" diameter',    image: "images/painting/hallow.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2015 ──────────────────────────────────────────────────────────────────
  { title: "Way",                       year: 2015, medium: "oil on panel",  dimensions: '15.5" × 20"',     image: "images/painting/way.webp",                       price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Under",                     year: 2015, medium: "oil on panel",  dimensions: '15.5" × 20"',     image: "images/painting/under.webp",                     price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Mound",                     year: 2015, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/mound.webp",                     price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2014 ──────────────────────────────────────────────────────────────────
  { title: "Landing",                   year: 2014, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/moundings.webp",                 price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Pile",                      year: 2014, medium: "oil on panel",  dimensions: '5.25" × 7"',      image: "images/painting/pile.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2013 ──────────────────────────────────────────────────────────────────
  { title: "River",                     year: 2013, medium: "oil on panel",  dimensions: '4.75" × 5.75"',   image: "images/painting/river.webp",                     price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2012 ──────────────────────────────────────────────────────────────────
  { title: "Danger",                    year: 2012, medium: "oil on panel",  dimensions: '2" × 4"',         image: "images/painting/wierdness.webp",                 price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Brief",                     year: 2012, medium: "oil on panel",  dimensions: '2.5" × 2.5"',     image: "images/painting/brief.webp",                     price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Wovvle",                    year: 2012, medium: "oil on panel",  dimensions: '2.5" × 2.5"',     image: "images/painting/wobble.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Nearable",                  year: 2012, medium: "oil on panel",  dimensions: '1.25" × 1.25"',   image: "images/painting/ma-2.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "10",                        year: 2012, medium: "oil on panel",  dimensions: '1.25" × 1.25"',   image: "images/painting/illusion.webp",                  price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Isollusion",                year: 2012, medium: "oil on panel",  dimensions: '1.25" × 1.25"',   image: "images/painting/pan.webp",                       price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2015 ──────────────────────────────────────────────────────────────────
  { title: "Opening",                   year: 2015, medium: "oil on panel",  dimensions: '2.5" × 2.5"',     image: "images/painting/opening.webp",                   price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Whistles",                  year: 2015, medium: "oil on panel",  dimensions: '2.5" × 2.5"',     image: "images/painting/wistles.webp",                   price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Halos",                     year: 2015, medium: "oil on panel",  dimensions: '1.25" × 1.25"',   image: "images/painting/halos.webp",                     price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2016 ──────────────────────────────────────────────────────────────────
  { title: "Anomalous",                 year: 2016, medium: "oil on panel",  dimensions: '8.5" × 11"',      image: "images/painting/anomolous.webp",                 price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Peep",                      year: 2016, medium: "oil on panel",  dimensions: '8.5" × 22"',      image: "images/painting/peep.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2013 ──────────────────────────────────────────────────────────────────
  { title: "Spirit",                    year: 2013, medium: "oil on panel",  dimensions: '4" × 5.25"',      image: "images/painting/spirit.webp",                    price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Member",                    year: 2013, medium: "oil on panel",  dimensions: '4" × 10.25"',     image: "images/painting/time.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2011 ──────────────────────────────────────────────────────────────────
  { title: "Bjorn",                     year: 2011, medium: "oil on panel",  dimensions: '32" × 42"',       image: "images/painting/bjorn.webp",                     price: "$18,000", stripeLink: "checkout.html" },
  { title: "Play",                      year: 2011, medium: "oil and wood",  dimensions: '8" × 14.5"',      image: "images/painting/play.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  { title: "Able",                      year: 2011, medium: "oil on panel",  dimensions: '32" × 42"',       image: "images/painting/able.webp",                      price: "$18,000", stripeLink: "checkout.html" },
  { title: "Well",                      year: 2011, medium: "oil on panel",  dimensions: '24" × 28"',       image: "images/painting/well.webp",                      price: "$12,000", stripeLink: "checkout.html" },
  // ── 2012 ──────────────────────────────────────────────────────────────────
  { title: "Purpose",                   year: 2012, medium: "oil on wood",   dimensions: '11.5" × 12"',     image: "images/painting/peck.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2011 ──────────────────────────────────────────────────────────────────
  { title: "Were",                      year: 2011, medium: "oil on panel",  dimensions: '32" × 42"',       image: "images/painting/were.webp",                      price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2012 ──────────────────────────────────────────────────────────────────
  { title: "On",                        year: 2012, medium: "oil on wood",   dimensions: '12" × 16"',       image: "images/painting/on.webp",                        price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2009 ──────────────────────────────────────────────────────────────────
  { title: "Little White",              year: 2009, medium: "oil on panel",  dimensions: '2.5" × 3.5"',     image: "images/painting/little-white.webp",              price: "$7,000",  stripeLink: "checkout.html" },
  // ── 2007 ──────────────────────────────────────────────────────────────────
  { title: "Claire and the Caged Bear", year: 2007, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/claire-and-the-caged-bear.webp", price: "$9,000",  stripeLink: "checkout.html" },
  { title: "Blue Harriet",              year: 2007, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/blue-harriet.webp",              price: "$9,000",  stripeLink: "checkout.html" },
  { title: "Parade",                    year: 2007, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/parade.webp",                    price: "$9,000",  stripeLink: "checkout.html" },
  { title: "Claire",                    year: 2007, medium: "oil on panel",  dimensions: '5" × 7"',         image: "images/painting/claire.webp",                    price: "$9,000",  stripeLink: "checkout.html" },
  // ── 2008 ──────────────────────────────────────────────────────────────────
  { title: "Youme",                     year: 2008, medium: "oil on panel",  dimensions: '4.5" × 7"',       image: "images/painting/dragon.webp",                    price: "$9,000",  stripeLink: "checkout.html" },
  // ── 2007 ──────────────────────────────────────────────────────────────────
  { title: "Nocturne",                  year: 2007, medium: "oil on panel",  dimensions: '5" × 6"',         image: "images/painting/nocturne.webp",                  price: "$9,000",  stripeLink: "checkout.html" },
];
