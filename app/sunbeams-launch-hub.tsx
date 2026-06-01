"use client";
import { useState, useRef, useEffect } from "react";

// ── Brand UI tokens (Sunbeams Lifestyle app chrome only) ──────────────────────
const B = {
  primary:"#CB0033", brown:"#A47860", beige:"#D6D2C4", cloud:"#F4F0EC",
  // Light mode surfaces
  bg:"#FAF7F4",        // warm off-white page bg
  surface:"#FFFFFF",  // card/panel bg
  surfaceAlt:"#F4F0EC", // Cloud Dancer — section bg
  border:"#E8DDD5",   // warm light border
  borderStrong:"#D6C8BC", // stronger border
  // Text
  text:"#2A1A10",     // near-black warm
  textMid:"#6B4A38",  // medium brown text
  muted:"#A08070",    // muted warm grey
  dimText:"#C4B0A0",  // very muted
};

const CATEGORIES = ["Skincare","Wellness","Home & Living","Lifestyle Accessories","Apparel","Food & Beverage","Fragrance","Hair Care","Other"];
const PLATFORMS  = ["Lazada","Shopee","TikTok Shop","Shopify","Instagram","Facebook"];

const EMPTY_PRODUCT = () => ({
  id: Date.now() + Math.random(),
  productName:"", category:"Skincare", size:"", color:"",
  shape:"", dimensions:"", inclusions:"", warranty:"", warrantyDuration:"",
  pricePoint:"", specialOffer:"",
});

// ── Demo presets for auto-fill ────────────────────────────────────────────────
const DEMO_PRESETS = [
  {
    label: "Quencha Drinkware Collection",
    brandInfo: {
      brandName: "Quencha",
      collectionName: "Quencha Hydration",
      launchDate: new Date(Date.now() + 28*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Lazada","Shopee","TikTok Shop","Shopify","Instagram","Facebook"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display, DM Sans",
      packagingDimensions: "Retail box: 22cm × 10cm × 10cm per unit",
      logoUrl: "",
    },
    products: [
      { id:1, productName:"Quencha 19oz & 37oz Insulated Tumbler", category:"Home & Living", size:"550ml / 1100ml", color:"Multiple colorways — Matte Black, Sage, Sand", shape:"Slim insulated tumbler with strap and silicone boot", dimensions:"23cm × 8cm (550ml)", inclusions:"Tumbler, silicone boot, carry strap, leak-proof lid", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱799.75", specialOffer:"Bundle 2 for ₱1,499" },
      { id:2, productName:"Quencha 17oz & 37oz Flip Cap Water Bottle", category:"Home & Living", size:"500ml / 1100ml", color:"Clear with colored flip cap — multiple variants", shape:"Slim plastic bottle with flip-top cap", dimensions:"24cm × 7cm (500ml)", inclusions:"Bottle with flip cap lid", warranty:"Manufacturer warranty", warrantyDuration:"6 months", pricePoint:"₱149.75", specialOffer:"3 for ₱399 launch promo" },
      { id:3, productName:"Quencha 12oz & 17oz Glass Water Bottle", category:"Home & Living", size:"350ml / 500ml", color:"Clear borosilicate glass with silicone sleeve — multiple colors", shape:"Cylindrical glass bottle with silicone protective sleeve", dimensions:"22cm × 6.5cm (500ml)", inclusions:"Glass bottle, silicone sleeve, leak-proof cap", warranty:"Manufacturer warranty", warrantyDuration:"6 months", pricePoint:"₱299.75", specialOffer:"Free silicone sleeve color upgrade on launch week" },
    ],
  },
  {
    label: "Crysalis Bar & Glassware",
    brandInfo: {
      brandName: "Crysalis",
      collectionName: "Crysalis Bar Essentials",
      launchDate: new Date(Date.now() + 28*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Shopify","Lazada","Shopee","TikTok Shop","Instagram"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display",
      packagingDimensions: "Gift-ready box per unit; set box: 30cm × 22cm × 14cm",
      logoUrl: "",
    },
    products: [
      { id:4, productName:"Crysalis 750ml Double Wall Cocktail Shaker", category:"Home & Living", size:"750ml", color:"Stainless steel with double-wall vacuum insulation", shape:"Classic cocktail shaker — tapered cylinder with strainer lid", dimensions:"23cm × 9cm diameter", inclusions:"Cocktail shaker, built-in strainer, twist-lock lid", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱529.75", specialOffer:"Free cocktail recipe card set on launch" },
      { id:5, productName:"Crysalis 1000ml Glass Teapot", category:"Home & Living", size:"1000ml", color:"Clear borosilicate glass with stainless steel infuser", shape:"Ergonomic teapot with curved spout and heat-resistant handle", dimensions:"18cm × 14cm × 13cm", inclusions:"Glass teapot, removable stainless steel infuser, silicone lid seal", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱599.75", specialOffer:"Bundle with Crysalis Double Wall Mugs: ₱999 (save ₱200)" },
      { id:6, productName:"Crysalis 1600ml Double Wall Wine Chiller Bucket", category:"Home & Living", size:"1600ml", color:"Brushed stainless steel, double-wall vacuum", shape:"Cylindrical wine/champagne chiller bucket", dimensions:"22cm height × 14cm diameter", inclusions:"Wine chiller bucket, removable inner liner, carry handle", warranty:"Manufacturer warranty", warrantyDuration:"1 year", pricePoint:"₱899.75", specialOffer:"Complimentary gift wrapping on launch week" },
    ],
  },
  {
    label: "Primeo Home Textiles",
    brandInfo: {
      brandName: "Primeo",
      collectionName: "Primeo Home Essentials",
      launchDate: new Date(Date.now() + 21*24*60*60*1000).toISOString().split("T")[0],
      platforms: ["Shopify","Instagram","Lazada","Shopee","TikTok Shop"],
      brandColors: "#CB0033 (Pantone 1935 C), #A47860, #D6D2C4, #F4F0EC (Cloud Dancer)",
      brandTypeface: "Playfair Display, DM Sans",
      packagingDimensions: "Kraft sleeve wrap per item; set box: 35cm × 25cm × 8cm",
      logoUrl: "",
    },
    products: [
      { id:7, productName:"Primeo 100% Cotton Popcorn Weave Beach Towel", category:"Home & Living", size:"70cm × 140cm", color:"Multiple colorways — Ecru, Sage, Dusty Rose, Stone", shape:"Oversized flat-weave towel with popcorn texture", dimensions:"70cm × 140cm folded to 25cm × 14cm", inclusions:"Beach towel, kraft tie wrap", warranty:"Quality guarantee", warrantyDuration:"6 months", pricePoint:"₱699.75", specialOffer:"Buy 2 get 1 free on launch week" },
      { id:8, productName:"Primeo Bathroom Accessory Set", category:"Home & Living", size:"4-piece set", color:"Matte White / Matte Black / Sand — matching set", shape:"Rectangular dispensers and holders — minimal profile", dimensions:"Soap dispenser: 8cm × 6cm × 18cm", inclusions:"Soap dispenser, toothbrush holder, tumbler, soap dish", warranty:"Quality guarantee", warrantyDuration:"6 months", pricePoint:"₱899.75", specialOffer:"Free bath mat with full set purchase" },
    ],
  },
];

// ── Infer benefit / audience per category ─────────────────────────────────────
function inferProduct(p, brandInfo) {
  const catBenefits = {
    "Skincare":["Visibly improves skin texture and radiance","Delivers deep hydration and nourishment","Supports a healthier, glowing complexion"],
    "Wellness":["Supports daily health and wellbeing routines","Promotes balance and vitality","Designed for the health-conscious lifestyle"],
    "Home & Living":["Elevates everyday living spaces","Combines form and function beautifully","Adds warmth and character to any home"],
    "Lifestyle Accessories":["Complements a refined, modern lifestyle","Crafted for those who appreciate quality details","The perfect finishing touch for your daily ritual"],
    "Apparel":["Designed for effortless style and comfort","Versatile enough for every occasion","Tailored to move with you through your day"],
    "Food & Beverage":["Crafted for discerning taste and quality","Made with premium ingredients for everyday indulgence","Nourishes the body and delights the senses"],
    "Fragrance":["Evokes emotion and memory with every wear","A signature scent that becomes part of your identity","Long-lasting and beautifully balanced"],
    "Hair Care":["Nourishes and strengthens from root to tip","Restores shine and vitality to every strand","A salon-quality ritual for your everyday routine"],
    "Other":["Crafted with quality and intention","Designed to complement your lifestyle","A premium addition to your daily routine"],
  };
  const catAudiences = {
    "Skincare":["Women aged 25–45 who prioritize clean beauty and self-care","Skin-conscious individuals seeking effective, premium skincare"],
    "Wellness":["Health-conscious adults who invest in their wellbeing","Individuals pursuing a balanced, intentional lifestyle"],
    "Home & Living":["Homeowners with a refined eye for interior aesthetics","Lifestyle enthusiasts who treat their home as a sanctuary"],
    "Lifestyle Accessories":["Modern professionals and lifestyle-driven individuals","Those who believe every detail of their daily ritual matters"],
    "Apparel":["Style-conscious individuals who value quality over quantity","Urban professionals seeking versatile, elevated wardrobe pieces"],
    "Food & Beverage":["Food lovers and quality-seekers who value premium ingredients","Health-conscious consumers who don't compromise on taste"],
    "Fragrance":["Fragrance enthusiasts who seek a signature, memorable scent","Individuals who express identity through scent"],
    "Hair Care":["Individuals seeking a premium, results-driven hair care ritual","Those who invest in salon-quality care at home"],
    "Other":["Lifestyle-oriented consumers who appreciate premium quality","Individuals who invest in products that reflect their values"],
  };
  const b = catBenefits[p.category]||catBenefits["Other"];
  const a = catAudiences[p.category]||catAudiences["Other"];
  const keyBenefit    = b[Math.floor(Math.random()*b.length)];
  const targetCustomer= a[Math.floor(Math.random()*a.length)];
  const details = [
    p.size        ? `Comes in ${p.size}`                        : "",
    p.color       ? `Available in ${p.color}`                   : "",
    p.shape       ? `Features a ${p.shape} design`              : "",
    p.dimensions  ? `Measuring ${p.dimensions}`                 : "",
    p.inclusions  ? `Includes ${p.inclusions}`                  : "",
    p.warranty    ? `Backed by a ${p.warrantyDuration||""} ${p.warranty}`.trim() : "",
  ].filter(Boolean);
  return { keyBenefit, targetCustomer, details, keyBenefit, targetCustomer };
}

// ── Image prompt builder ───────────────────────────────────────────────────────
function buildImagePrompt(type, product, brandInfo, inf) {
  const brand = brandInfo.brandName || "Sunbeams Lifestyle";
  const colorNote = brandInfo.brandColors
    ? `Brand color palette for backgrounds/props: ${brandInfo.brandColors}.`
    : "Use a warm, elevated color palette with neutral tones and soft contrasts.";
  const typefaceNote = brandInfo.brandTypeface
    ? `Brand typeface for any text overlays: ${brandInfo.brandTypeface}.`
    : "";
  const shapeNote = product.shape ? `The product has a ${product.shape} form.` : "";
  const colorProd = product.color ? `Product color/finish: ${product.color}.` : "";

  // Product-only base — no brand theme applied to the product itself
  const productBase = `Premium product photography. Product: ${product.productName}, category: ${product.category}. ${shapeNote} ${colorProd} ${inf.keyBenefit}. Photorealistic, editorial quality, high-end commercial photography style.`;

  // Platform/social base — brand theme applied to environment, backgrounds, props only (never to the product)
  const platformBase = `${productBase} ${colorNote} ${typefaceNote} Brand: ${brand}.`;

  const prompts = {
    mockup: `${productBase} Clean hero product shot on a minimal neutral surface with soft natural shadows. Product centered, beautifully lit, no text or overlays, no branding applied to the product. Pure product beauty shot suitable for e-commerce.`,
    social_feed: `${platformBase} Lifestyle flat lay or styled scene for Instagram feed. Product surrounded by complementary lifestyle props that suggest ${inf.targetCustomer.split(" ").slice(0,4).join(" ")}. Brand palette applied to props and background only — product appearance unchanged. Warm, aspirational mood. Square composition.`,
    social_story: `${platformBase} Vertical 9:16 lifestyle image for Instagram/TikTok stories. Product held or in use in a natural setting. Brand palette in background and styling only. Bright, warm, inviting atmosphere. Space at top for text overlay.`,
    lazada: `${platformBase} E-commerce hero banner 1:1 square format. Product on clean white or very light background. Professional lighting. Brand colors used in background accents only. Suitable for Lazada/Shopee marketplace listing main image.`,
    shopee: `${platformBase} Lifestyle product banner. Product featured prominently with soft background gradient using brand palette. Clean, vibrant, marketplace-ready. Brand theme in environment only. Horizontal composition.`,
    tiktok: `${platformBase} Vertical product reveal thumbnail. Dramatic lighting with the product as the clear hero. Eye-catching enough to stop a scroll. Dark or gradient background with product glowing. Brand palette in background only.`,
  };
  return prompts[type] || prompts.mockup;
}

// ── Claude API call for image generation ──────────────────────────────────────
async function generateImage(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      messages:[{
        role:"user",
        content:`You are an image generation prompt optimizer. Take this prompt and return ONLY a refined, detailed image generation prompt (no explanation, no preamble, just the prompt text):\n\n${prompt}`
      }]
    })
  });
  const data = await response.json();
  // Return the refined prompt text to display since we can't generate actual images
  const text = data.content?.map(b=>b.text||"").join("") || prompt;
  return text;
}

// ── Launch plan generator (local) ─────────────────────────────────────────────
function generateLaunchPlan(brandInfo, products) {
  const brand      = brandInfo.brandName      || "Sunbeams Lifestyle";
  const collection = brandInfo.collectionName || "";
  const platforms  = brandInfo.platforms;
  const launchDate = brandInfo.launchDate;

  const inferred = {};
  products.forEach(p => { inferred[p.id] = inferProduct(p, brandInfo); });

  // First product drives the top-level theme
  const mainInf = inferred[products[0].id];

  // Strip leading brand name from collection if already present
  // e.g. "Quencha Hydration" → "Hydration", so we safely prepend brand once
  const collectionShort = collection
    ? (collection.toLowerCase().startsWith(brand.toLowerCase())
        ? collection.slice(brand.length).trim()
        : collection.trim())
    : "";
  const collectionFull = collectionShort ? `${brand} ${collectionShort}` : "";

  const theme = collectionFull
    ? `${collectionFull} — ${mainInf.keyBenefit.split(" ").slice(0,4).join(" ")}`
    : `${products[0].productName} — ${mainInf.keyBenefit.split(" ").slice(0,4).join(" ")}`;

  const productList = products.map(p=>`${p.productName} (${p.category})`).join(", ");
  const collectionStr = collectionFull ? ` ${collectionFull} Collection` : "";

  // ── BRIEFS ────────────────────────────────────────────────────────────────
  const briefs = {
    packaging:{
      objective:`Deliver launch-ready packaging for the${collectionStr} range: ${productList}. Each product has its own packaging spec — see per-product details below.`,
      deliverables: [
        `Primary packaging per SKU — confirm specs with Creative Director before production`,
        `Secondary packaging (box/sleeve/bag) with campaign theme: "${theme}"`,
        ...products.map(p=>{
          const parts=[
            p.size       ? `Size: ${p.size}`        : "",
            p.shape      ? `Shape: ${p.shape}`       : "",
            p.dimensions ? `Dims: ${p.dimensions}`   : "",
            p.inclusions ? `Includes: ${p.inclusions}`: "",
            p.warranty   ? `Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim() : "",
          ].filter(Boolean).join(" · ");
          return `${p.productName}: ${parts||"spec TBC with team"}`;
        }),
        `Photography-ready samples (min. 6 units per SKU) for creative shoot`,
        `All packing materials, cards, and inserts QC-checked before dispatch`,
      ],
      guidelines:[
        ...(brandInfo.brandColors
          ? [`Brand colors confirmed per product brief: ${brandInfo.brandColors}. Apply consistently.`]
          : []),
        ...(brandInfo.brandTypeface
          ? [`Brand typeface: ${brandInfo.brandTypeface} — use for all on-pack typography`]
          : []),
        `Packaging dimensions must match confirmed specs before production run begins`,
        `Use recyclable or FSC-certified materials wherever possible`,
      ],
      deadline:`Week 1 — samples ready Day 5; final production units Day 18`,
      notes:`Each product in the collection may have different packaging specs. Confirm individually with Creative Director before briefing vendor.`,
    },
    creative:{
      objective:`Produce all digital and visual assets for the${collectionStr} launch (${productList}) across all channels (${platforms.join(", ")}). Campaign: "${theme}".`,
      deliverables:[
        `Hero campaign images per product (min. 8 selects each) — product on white, lifestyle, detail shots`,
        `Collection hero shot — all ${products.length} product${products.length>1?"s":""} together in one styled scene`,
        `Video: 15s & 30s launch video, TikTok hook per product (3s problem/5s reveal/15s demo/5s CTA)`,
        `Static ad creatives per platform per product — Lazada, Shopee, Meta, TikTok`,
        `Shopify: collection landing page banner + individual PDPs`,
        `Retail POS materials — A4 in-store signage (for Sales/B2B partners to print), shelf talker, A3 standee, wobbler per product`,
        `B2B asset pack per product for Sales team: product video (MP4), hero image (hi-res JPG), A4 signage (print-ready PDF)`,
      ],
      guidelines:[
        ...(brandInfo.brandColors
          ? [`Use brand colors: ${brandInfo.brandColors}`]
          : []),
        `One primary message per asset, one CTA — no visual clutter`,
        `Review all assets in platform context before sign-off`,
        `Deliver in platform-specific specs — no resizing without quality check`,
      ],
      deadline:`Week 2 — shoot Day 8–9; first drafts Day 12; final assets Day 18`,
      notes:`Multi-product collection requires individual and group shots. Allocate extra studio time.`,
    },
    ecommerce:{
      objective:`Set up and optimize all ${products.length} product listing${products.length>1?"s":""} from the${collectionStr} range across all platforms simultaneously. Day 1 top-page visibility.`,
      deliverables: [
        ...products.map(p=>`${p.productName}: Lazada, Shopee, TikTok Shop & Shopify listings — copy, images, pricing, stock`),
        `Collection landing page on Shopify featuring all ${products.length} SKU${products.length>1?"s":""}`,
        `TikTok Shop: product showcase, affiliate commission at 15% per product`,
        `Klaviyo abandoned cart flows: 1hr, 24hr, 72hr per product`,
        `Cross-platform pricing parity confirmed across all SKUs`,
      ],
      guidelines:[
        `Title: Brand + Product Name + Key Feature + Variant — max 120 characters`,
        `All listings go LIVE simultaneously at 9:00 AM on launch day`,
        `Vouchers and shipping subsidies active on all platforms at launch`,
        `Confirm FBL/stock allocation per SKU 1 week before launch`,
      ],
      deadline:`Week 2 — drafts Day 10; assets loaded Day 16; QA Day 20; live Day 25`,
      notes:`${products.length} SKU${products.length>1?"s need individual":"needs"} QA. Allow extra time for multi-product listings check.`,
    },
    marketing:{
      objective:`Drive consumer awareness, digital acquisition, and online sales for the${collectionStr} range (${productList}) across all digital channels and platforms. Campaign: "${theme}".`,
      deliverables:[
        `Paid media plan: Meta (Feed, Stories, Reels), TikTok Ads (VSA, TopView), Google (Search + Shopping) — budgeted per product`,
        `Influencer/KOL campaign: 3–5 micro-influencers (10K–100K) briefed on full${collectionStr} collection`,
        `Email campaign: teaser (D-7), launch day, post-launch follow-up (D+3) via Klaviyo`,
        `PR outreach: press release and media kit sent to lifestyle, beauty, and home media`,
        `Organic social content calendar: teaser posts, launch day content, post-launch UGC amplification`,
      ],
      guidelines:[
        `All messaging anchored to campaign theme: "${theme}" — consistent across every channel`,
        `UTM parameters on every digital link before publishing — no exceptions`,
        `A/B test one element per ad set — headline, image, or audience — not all at once`,
        `Daily launch week report: impressions, CTR, CVR, ROAS, GMV per platform — to PM by 6PM`,
      ],
      deadline:`Week 1 — media plan approved Day 3; influencer briefs sent Day 5; email sequences built Day 7`,
      notes:`Multi-product collection — ensure each SKU has dedicated creative assets in the paid media plan. Coordinate with Digital Creative for all asset deliveries.`,
    },
    sales:{
      objective:`Notify, brief, and equip all B2B wholesale clients, distributors, and retail trade partners (hotels, restaurants, cafés, independent retailers) on the${collectionStr} launch. Drive wholesale orders and ensure in-store visibility.`,
      deliverables:[
        `B2B launch announcement email — product overview, pricing, MOQ, and order process for all ${products.length} SKU${products.length>1?"s":""}`,
        `Viber group announcement to all active B2B partners — teaser message (D-7) and launch day "Now Live" blast`,
        `Wholesale product deck: collection overview, product specs, imagery, pricing tiers, and ordering details`,
        `A4 in-store signage (received from Digital Creative team) — printed and distributed to all retail partners`,
        `Product video and hero images (received from Digital Creative team) — sent to all B2B partners for in-store and digital use`,
      ],
      guidelines:[
        `Coordinate with Digital Creative by Week 1 — request: product video, hero images, and A4 signage files`,
        `All B2B comms (email + Viber) go out simultaneously — no partner receives information before others`,
        `Wholesale pricing and MOQ details must be confirmed with management before any B2B communication`,
        `A4 signage files must be reviewed and approved before sending to print or distributing to partners`,
      ],
      deadline:`Week 1 — B2B deck ready Day 3; creative assets requested from Creative team Day 3; first Viber teaser Day 7`,
      notes:`Sales team is the direct point of contact for all B2B wholesale, distributor, hotel, restaurant, and café partners. All trade communications go through Sales. Digital Creative team supplies assets — Sales team distributes them.`,
    },
  };

  // ── TASKS ─────────────────────────────────────────────────────────────────
  const tasks = {
    packaging:[
      {week:1,task:`Kick-off with Creative Director — confirm packaging specs per SKU: ${productList}`,owner:"Packaging Lead",priority:"high",done:false},
      {week:1,task:`Brief packaging vendor with individual specs, quantities, and delivery timeline per product`,owner:"Packaging Lead",priority:"high",done:false},
      {week:1,task:`Order raw materials and packaging components for all ${products.length} SKU${products.length>1?"s":""}`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Produce photography-ready samples (min. 6 units per SKU) for creative shoot`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Quality check per product: print accuracy, structural integrity, color match`,owner:"Packaging Lead",priority:"high",done:false},
      {week:2,task:`Deliver approved samples to Creative team for shoot`,owner:"Packaging Lead",priority:"medium",done:false},
      {week:3,task:`Sign off on print proofs for all SKUs — approve final production runs`,owner:"Packaging Lead",priority:"high",done:false},
      {week:3,task:`Coordinate retail-ready units with logistics for shelf deployment`,owner:"Packaging Lead",priority:"medium",done:false},
      {week:4,task:`Confirm all units (all SKUs) delivered to warehouse and retail, ready for launch`,owner:"Packaging Lead",priority:"high",done:false},
    ],
    creative:[
      {week:1,task:`Creative brief + mood board + shot list for full${collectionStr} collection`,owner:"Creative Director",priority:"high",done:false},
      {week:1,task:`Book photographer, videographer, and studio — allocate extra time for ${products.length} SKU${products.length>1?"s":""}`,owner:"Creative Director",priority:"high",done:false},
      {week:1,task:`Prepare shoot props and styling for all products in the collection`,owner:"Creative Team",priority:"medium",done:false},
      {week:2,task:`Full collection shoot — individual hero shots + group collection shot`,owner:"Creative Director",priority:"high",done:false},
      {week:2,task:`TikTok hook video per product (3s/5s/15s/5s formula)`,owner:"Creative Team",priority:"high",done:false},
      {week:2,task:`First draft: hero images, platform banners, and ad creatives per product`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Internal review — check all assets per product in platform context`,owner:"Creative Director",priority:"high",done:false},
      {week:3,task:`Final asset delivery to E-Commerce team for all listings`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Retail POS materials — shelf talker, standee, wobbler per product`,owner:"Creative Team",priority:"medium",done:false},
      {week:3,task:`Prepare B2B asset pack per product for Sales team: product video (MP4), hero images (hi-res), A4 signage (print-ready PDF)`,owner:"Creative Team",priority:"high",done:false},
      {week:3,task:`Hand off B2B asset pack to Sales team — confirm receipt and print readiness of A4 signage`,owner:"Creative Director",priority:"high",done:false},
      {week:4,task:`Final QA on all live assets across all platforms and devices`,owner:"Creative Director",priority:"high",done:false},
    ],
    ecommerce:[
      {week:1,task:`Create draft listings for all ${products.length} SKU${products.length>1?"s":""} on all platforms`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:1,task:`Configure TikTok Shop affiliate (15%) and product showcase for each SKU`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:2,task:`Upload final copy and assets to all listings per product`,owner:"E-Commerce Team",priority:"high",done:false},
      {week:2,task:`Set up Klaviyo abandoned cart: 1hr, 24hr, 72hr for each product`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:2,task:`Configure platform vouchers and shipping subsidies per SKU`,owner:"E-Commerce Team",priority:"medium",done:false},
      {week:3,task:`Full QA per SKU: images, copy, pricing, stock on all platforms`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:3,task:`Inventory allocation per channel per SKU (30-day velocity forecast)`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:3,task:`Build Shopify collection page featuring all ${products.length} product${products.length>1?"s":""}`,owner:"E-Commerce Team",priority:"high",done:false},
      {week:4,task:`Set all SKUs to go live at 9:00 AM on launch day`,owner:"E-Commerce Manager",priority:"high",done:false},
      {week:4,task:`Monitor GMV, CVR, and stock per SKU hourly on launch day`,owner:"E-Commerce Team",priority:"high",done:false},
    ],
    marketing:[
      {week:1,task:`Finalize paid media plan: budget per product per channel (Meta, TikTok Ads, Google Search & Shopping)`,owner:"Marketing Manager",priority:"high",done:false},
      {week:1,task:`Brief 3–5 micro-influencers (10K–100K) — send${collectionStr} collection overview and product samples`,owner:"Marketing Manager",priority:"high",done:false},
      {week:2,task:`Teaser content — collection reveal posts D-7 and D-5 on Instagram, TikTok, and Facebook`,owner:"Marketing Manager",priority:"medium",done:false},
      {week:2,task:`Build all paid media campaigns in draft — creatives and audiences set per product`,owner:"Marketing Manager",priority:"high",done:false},
      {week:2,task:`Ship influencer seeding packages with full collection brief and brand guidelines`,owner:"Marketing Manager",priority:"high",done:false},
      {week:3,task:`Email campaigns in Klaviyo: teaser (D-7), launch day, post-launch follow-up (D+3)`,owner:"Marketing Manager",priority:"high",done:false},
      {week:3,task:`Press release and media kit for${collectionStr} collection — distribute to lifestyle, beauty, and home media`,owner:"Marketing Manager",priority:"medium",done:false},
      {week:4,task:`Activate all paid media campaigns at 8:00 AM on launch day`,owner:"Marketing Manager",priority:"high",done:false},
      {week:4,task:`Monitor and report daily: impressions, CTR, CVR, ROAS, GMV — report to PM by 6PM each day`,owner:"Marketing Manager",priority:"high",done:false},
    ],
    sales:[
      {week:1,task:`Prepare B2B launch announcement: product/collection overview deck for wholesale clients and distribution partners`,owner:"Sales Manager",priority:"high",done:false},
      {week:1,task:`Compile B2B client list: wholesalers, distributors, hotels, restaurants, and café partners`,owner:"Sales Manager",priority:"high",done:false},
      {week:1,task:`Coordinate with Digital Creative team — request product video, hero images, and A4 signage files for physical stores`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Send Viber group announcement to all B2B partners: product/collection teaser with launch date`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Send email blast to wholesale and distributor list — include product deck, pricing, and MOQ details`,owner:"Sales Manager",priority:"high",done:false},
      {week:2,task:`Confirm A4 signage files received from Creative team — review and approve for printing`,owner:"Sales Manager",priority:"high",done:false},
      {week:3,task:`Follow-up call/Viber message to key B2B accounts — confirm orders and stock requirements`,owner:"Sales Manager",priority:"high",done:false},
      {week:3,task:`Distribute printed A4 signage and product assets (video, images) to retail partners for in-store display`,owner:"Sales Team",priority:"high",done:false},
      {week:3,task:`Confirm product delivery schedule with logistics for all B2B wholesale orders`,owner:"Sales Manager",priority:"medium",done:false},
      {week:4,task:`Launch day Viber blast to all B2B partners — "Now Live" announcement with buy links and reorder info`,owner:"Sales Manager",priority:"high",done:false},
      {week:4,task:`Launch day email to all B2B clients — full collection is live, include platform links, pricing, and contact for orders`,owner:"Sales Manager",priority:"high",done:false},
      {week:4,task:`Post-launch B2B check-in: gather sell-through feedback from retail partners; flag reorder needs to logistics`,owner:"Sales Team",priority:"medium",done:false},
    ],
  };

  // ── COPY (first product as primary, rest appended) ─────────────────────────
  const mainP = products[0];
  const mainInfData = inferred[mainP.id];
  const platformKeyMap = {"Lazada":"lazada","Shopee":"shopee","TikTok Shop":"tiktok","Shopify":"shopify","Instagram":"instagram","Facebook":"facebook"};

  const allCopy = {};
  platforms.forEach(p => {
    const k = platformKeyMap[p];
    if(!k) return;
    allCopy[k] = buildCopyForPlatform(k, products, inferred, brand, collection, theme, brandInfo);
  });

  // ── CALENDAR ──────────────────────────────────────────────────────────────
  const calendar = {
    week1:{ theme:"Foundation — Strategy, Briefing & Kick-Off", days:[
      {day:"Day 1", team:"All Teams",  action:`Launch kick-off — share collection brief, "${theme}", timelines for all ${products.length} SKU${products.length>1?"s":""}`, type:"planning"},
      {day:"Day 2", team:"Creative",  action:`Brief packaging vendor per SKU; confirm specs, quantities, delivery dates`,type:"production"},
      {day:"Day 3", team:"Marketing",  action:`Finalize paid media plan; brief 3–5 micro-influencers on full${collectionStr} collection`,type:"planning"},
      {day:"Day 3", team:"Sales", action:`Prepare B2B launch deck; request product video, images & A4 signage from Creative team`,type:"planning"},
      {day:"Day 4", team:"Digital Creative",   action:`Collection creative brief, mood board, and shot list; book studio`,type:"planning"},
      {day:"Day 5", team:"E-Commerce", action:`Create draft listings for all ${products.length} SKU${products.length>1?"s":""} on all platforms`,type:"setup"},
      {day:"Day 7", team:"All Teams",  action:`Week 1 check-in — vendors briefed, budgets approved, timelines locked`,type:"review"},
    ]},
    week2:{ theme:"Production — Shoot, Assets & Listing Build", days:[
      {day:"Day 8", team:"Creative",  action:`Photography-ready samples (all SKUs) delivered to Creative team`,type:"production"},
      {day:"Day 9", team:"Digital Creative",   action:`Collection shoot — individual hero shots + group shot for all ${products.length} products`,type:"production"},
      {day:"Day 10",team:"Marketing",  action:`Teaser content live — collection reveal D-14; influencer packages shipped`,type:"production"},
      {day:"Day 10",team:"Sales", action:`Send Viber teaser blast + email to all B2B partners — launch date and product preview`,type:"production"},
      {day:"Day 11",team:"E-Commerce", action:`Upload final copy and assets to all listings; TikTok affiliate configured`,type:"setup"},
      {day:"Day 12",team:"Digital Creative",   action:`First draft assets — all platform banners and ad creatives per product`,type:"review"},
      {day:"Day 14",team:"All Teams",  action:`Week 2 review — assets, listings, influencer confirmation`,type:"review"},
    ]},
    week3:{ theme:"Finalization — QA, Load & Retail Deployment", days:[
      {day:"Day 15",team:"Digital Creative",   action:`Final asset delivery to E-Commerce; retail POS sent to print`,type:"production"},
      {day:"Day 16",team:"E-Commerce", action:`Full QA per SKU on all platforms: images, copy, pricing, stock`,type:"review"},
      {day:"Day 17",team:"Marketing",  action:`All paid campaigns in draft; Klaviyo email sequences live`,type:"setup"},
      {day:"Day 18",team:"Creative",  action:`All production units to warehouse; inventory allocated per channel`,type:"production"},
      {day:"Day 19",team:"Sales", action:`Distribute A4 signage + product assets to retail partners; confirm wholesale orders`,type:"setup"},
      {day:"Day 20",team:"Sales", action:`Follow-up Viber message to key accounts — confirm receipt of assets and stock readiness`,type:"review"},
      {day:"Day 21",team:"All Teams",  action:`Pre-launch war room — all platforms ready, campaigns loaded, stock confirmed`,type:"review"},
    ]},
    week4:{ theme:"Launch Week — Go Live, Monitor & Optimize", days:[
      {day:"Day 22",team:"E-Commerce", action:`All SKUs scheduled to publish at 9:00 AM; vouchers and boosts queued`,type:"setup"},
      {day:"Day 23",team:"Marketing",  action:`Paid campaigns set to activate 8:00 AM; influencer launch-day posts confirmed`,type:"launch"},
      {day:"Day 23",team:"Sales", action:`Schedule launch day Viber blast + email — "Now Live" with buy links and reorder info`,type:"launch"},
      {day:"Day 24",team:"All Teams",  action:`Final pre-launch briefing — roles, KPIs, and escalation path confirmed`,type:"review"},
      {day:"Day 25",team:"All Teams",  action:`🚀 LAUNCH DAY — All ${products.length} SKU${products.length>1?"s":""} go live simultaneously at 9:00 AM. Monitor hourly.`,type:"launch"},
      {day:"Day 26",team:"E-Commerce", action:`Day 1 review — reallocate spend to top-performing SKUs and platforms`,type:"monitor"},
      {day:"Day 27",team:"Sales", action:`Post-launch B2B check-in — gather sell-through from retail partners; flag reorders`,type:"monitor"},
      {day:"Day 28",team:"All Teams",  action:`Week 1 post-launch report — GMV per SKU, ROAS, sell-through, B2B order volume, learnings`,type:"monitor"},
    ]},
  };

  return { briefs, tasks, calendar, copy: allCopy, inferred };
}

// Capitalize first letter of a string (sentence-safe)
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

function buildCopyForPlatform(platform, products, inferred, brand, collection, theme, brandInfo) {
  // Strip brand from collection if already present, then build canonical forms
  const _colShort = collection
    ? (collection.toLowerCase().startsWith(brand.toLowerCase())
        ? collection.slice(brand.length).trim()
        : collection.trim())
    : "";
  const _colFull = _colShort ? `${brand} ${_colShort}` : "";
  // " Quencha Hydration Collection" for inline sentence use
  const col = _colFull ? ` ${_colFull} Collection` : "";
  // "Quencha Hydration" prefix for titles/headlines
  const prefix = _colFull || brand;
  // Strip leading brand from product name so prefix + shortName never duplicates
  const shortName = (p) => {
    const n = p.productName.trim();
    return n.toLowerCase().startsWith(brand.toLowerCase())
      ? n.slice(brand.length).trim()
      : n;
  };
  const p1 = products[0];
  const inf1 = inferred[p1.id];

  const productLines = products.map(p => {
    const inf = inferred[p.id];
    const specs = [p.size,p.color,p.inclusions].filter(Boolean).join(", ");
    return `• ${p.productName}${specs?" ("+specs+")":""} — ${inf.keyBenefit}`;
  }).join("\n");

  if(platform==="lazada") return {
    collectionTitle: `${prefix} | ${products.length>1?products.length+" Products":"Premium "+p1.category}`,
    products: products.map(p=>({
      name: p.productName,
      title:`${prefix} ${shortName(p)}${p.color?" — "+p.color:""} | ${inferred[p.id].keyBenefit.split(" ").slice(0,4).join(" ")}`,
      bullets:[
        `✦ ${inferred[p.id].keyBenefit}`,
        p.size       ?`✦ Size: ${p.size}`        :null,
        p.color      ?`✦ Color: ${p.color}`     :null,
        p.inclusions ?`✦ Includes: ${p.inclusions}`:null,
        p.warranty   ?`✦ Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim():null,
        `✦ Official ${brand} Store`,
      ].filter(Boolean),
      keywords:[p.productName, brand, collection, p.category, inferred[p.id].keyBenefit.split(" ").slice(0,3).join(" ")].filter(Boolean),
    })),
  };

  if(platform==="shopee") return {
    collectionTitle:`${prefix} — ${products.length>1?"Full Collection":"New Launch"}`,
    products: products.map(p=>({
      name: p.productName,
      title:`${prefix} ${shortName(p)}${p.color?" | "+p.color:""} | ${p.category}`,
      bullets:[
        `🌟 ${inferred[p.id].keyBenefit}`,
        p.size       ?`📏 Size: ${p.size}`        :null,
        p.color      ?`🎨 Color: ${p.color}`     :null,
        p.inclusions ?`📦 Includes: ${p.inclusions}`:null,
        p.warranty   ?`🛡️ ${p.warrantyDuration||""} ${p.warranty}`.trim():null,
        `⭐ Official ${brand} Shopee Store`,
      ].filter(Boolean),
    })),
  };

  if(platform==="tiktok") return {
    collectionHook:`POV: You discovered the ${prefix} collection and your ${p1.category.toLowerCase()} routine changed forever 👀`,
    liveOpeningScript:`"Welcome to ${brand} LIVE! Today we're launching${col} — ${products.length} new product${products.length>1?"s":""} you've been waiting for!\n${productLines}\n\nWe have an exclusive launch offer active right now. Tap the pin below before it's gone!"`,
    products: products.map(p=>({
      name: p.productName,
      videoHook:`POV: You finally found the ${p.category.toLowerCase()} that ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}… 👀`,
      caption:`${prefix} ${shortName(p)} ✨\n${cap(inferred[p.id].keyBenefit)}\n${p.size?"Size: "+p.size+" · ":""}${p.color?p.color:""}\n\nShop via TikTok Shop 🛍️`,
      hashtags:[`#${p.productName.replace(/\s+/g,"")}`,`#${brand.replace(/\s+/g,"")}`,collection?`#${collection.replace(/\s+/g,"")}`:null,`#${p.category.replace(/\s+/g,"")}`,`#NewLaunch`,`#TikTokShop`].filter(Boolean),
    })),
  };

  if(platform==="shopify") return {
    collectionPage:{
      heroHeadline: theme,
      subheadline:`${products.length} Product${products.length>1?"s":""} · ${prefix}`,
      collectionDescription:`Introducing the ${prefix} collection from ${brand}. A curated range designed for ${inf1.targetCustomer}. ${productLines}`,
    },
    products: products.map(p=>({
      name: p.productName,
      heroHeadline: `${prefix} ${shortName(p)} — ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}`,
      description: `${prefix} ${shortName(p)}.\n\n${cap(inferred[p.id].keyBenefit)}.\n\nDesigned for ${inferred[p.id].targetCustomer}.\n${[p.size&&"Size: "+p.size,p.color&&"Color: "+p.color,p.inclusions&&"Includes: "+p.inclusions,p.warranty&&`Warranty: ${p.warrantyDuration||""} ${p.warranty}`.trim()].filter(Boolean).join(" · ")}`,
      metaTitle:`${prefix} ${shortName(p)} | ${p.category} | ${brand}`,
    })),
  };

  if(platform==="instagram") return {
    collectionRevealCaption:`Introducing the ${prefix} collection. ✨\n\n${theme}.\n\n${products.length} new product${products.length>1?"s":""} crafted for ${inf1.targetCustomer}.\n\n${productLines}\n\n#${brand.replace(/\s+/g,"")} ${collection?"#"+collection.replace(/\s+/g,"")+" ":""}#NewLaunch #LifestyleBrand`,
    products: products.map(p=>({
      name: p.productName,
      feedCaption:`${prefix} ${shortName(p)}. ✨\n\n${cap(inferred[p.id].keyBenefit)}.\n\nPart of${col}.\n\n#${brand.replace(/\s+/g,"")} ${collection?"#"+collection.replace(/\s+/g,"")+" ":""}#${p.productName.replace(/\s+/g,"")} #NewLaunch #${p.category.replace(/\s+/g,"")}`,
      storyText:`NEW ✦ ${prefix}\n${shortName(p)}\n${cap(inferred[p.id].keyBenefit)}\nSwipe up to shop 🛍️`,
    })),
  };

  if(platform==="facebook") return {
    collectionAd:{
      headline:`Introducing ${prefix} by ${brand}`,
      body:`${products.length} new product${products.length>1?"s":""} crafted for ${inf1.targetCustomer}.\n\n${productLines}\n\nShop the full collection now.`,
      cta:"Shop Now",
    },
    products: products.map(p=>({
      name: p.productName,
      headline:`${prefix} ${shortName(p)} — ${inferred[p.id].keyBenefit.split(" ").slice(0,5).join(" ")}`,
      body:`${cap(inferred[p.id].keyBenefit)}. Made for ${inferred[p.id].targetCustomer}. ${[p.size,p.color,p.inclusions].filter(Boolean).join(" · ")}`,
      cta:"Shop Now",
    })),
  };

  return {};
}

// ── UI ────────────────────────────────────────────────────────────────────────
const TypeColor={planning:"#A47860",production:"#CB0033",setup:"#D6D2C4",review:"#C4B0A0",launch:"#CB0033",monitor:"#A47860"};
const TEAMS=[
  {id:"packaging",label:"Creative",       icon:"⬡",color:B.brown},
  {id:"creative", label:"Digital Creative",icon:"✦",color:B.primary},
  {id:"ecommerce",label:"E-Commerce",      icon:"◆",color:B.beige},
  {id:"marketing",label:"Marketing",       icon:"▲",color:B.primary},
  {id:"sales",    label:"Sales",             icon:"◈",color:"#A47860"},
];

// ── Upstash Redis helpers ─────────────────────────────────────────────────────
const KV_URL   = "https://sincere-seahorse-140709.upstash.io";
const KV_TOKEN = "gQAAAAAAAiWlAAIgcDFlMGJlN2M1NmRhYWM0YTNhODgzN2RmNzY4MWZjMWIyNA";
async function kvGet(key:string){
  try{
    const r=await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`,{headers:{Authorization:`Bearer ${KV_TOKEN}`}});
    const j=await r.json();
    if(!j.result) return null;
    try{ return JSON.parse(j.result); }catch{ return j.result; }
  }catch{ return null; }
}
async function kvSet(key:string,value:unknown){
  try{
    const encoded = encodeURIComponent(JSON.stringify(value));
    await fetch(`${KV_URL}/set/${encodeURIComponent(key)}/${encoded}`,{method:"GET",headers:{Authorization:`Bearer ${KV_TOKEN}`}});
  }catch{}
}

export default function LaunchHub(){
  const [step,setStep]           = useState("home");
  const [activeResult,setAR]     = useState("tasks");
  const [results,setResults]     = useState({});
  const [selTeam,setSelTeam]     = useState("packaging");
  const [selPlat,setSelPlat]     = useState("lazada");
  const [selWeek,setSelWeek]     = useState("week1");
  const [selProd,setSelProd]     = useState(0);
  const [taskState,setTaskState] = useState({});
  const [errors,setErrors]       = useState({});
  const [imgTab,setImgTab]       = useState("mockup");
  const [imgPrompts,setImgPrompts]= useState({});
  const [imgLoading,setImgLoading]= useState(false);
  const [showPresets,setShowPresets] = useState(false);
  const [kvLoaded,setKvLoaded]   = useState(false);
  const [launches,setLaunches]   = useState<any[]>([]);
  const [activeLaunchId,setActiveLaunchId] = useState<string|null>(null);
  const [savedBrands,setSavedBrands] = useState<any[]>([]);
  const [brandForm,setBrandForm] = useState<any|null>(null); // null=list, obj=editing
  const [homeTab,setHomeTab] = useState<"launches"|"brands">("launches");

  // Load all saved launches on mount
  useEffect(()=>{
    (async()=>{
      let list:any[] = [];
      const saved = await kvGet("sl-hub-launches");
      if(saved && Array.isArray(saved) && saved.length){
        list = saved;
      } else {
        // Migrate from old single-launch key
        const old = await kvGet("sl-hub-state");
        if(old?.results && Object.keys(old.results).length){
          const taskTeams = Object.keys(old.results.tasks||{});
          const migrated = {
            id: `launch-migrated-${Date.now()}`,
            label: "Previous Launch",
            brandName: "Sunbeams Lifestyle",
            launchDate: "",
            productCount: Object.keys(old.results.inferred||{}).length || 1,
            createdAt: new Date().toISOString(),
            results: old.results,
            taskState: old.taskState || {},
          };
          list = [migrated];
          kvSet("sl-hub-launches", list);
        }
      }
      if(list.length) setLaunches(list);
      const brands = await kvGet("sl-hub-brands");
      if(brands && Array.isArray(brands)) setSavedBrands(brands);
      setKvLoaded(true);
    })();
  },[]);

  const saveLaunches = (list:any[]) => {
    setLaunches(list);
    kvSet("sl-hub-launches", list);
  };

  const openLaunch = (launch:any) => {
    setResults(launch.results);
    setTaskState(launch.taskState||{});
    setActiveLaunchId(launch.id);
    setStep("results");
    setAR("tasks");
  };

  const deleteLaunch = (id:string, e:any) => {
    e.stopPropagation();
    if(!confirm("Delete this launch?")) return;
    saveLaunches(launches.filter(l=>l.id!==id));
  };

  const [brandInfo,setBrandInfo] = useState({
    brandName:"", collectionName:"",
    launchDate:"", platforms:["Lazada","Shopee","TikTok Shop","Shopify"],
    brandColors:"", brandTypeface:"", packagingDimensions:"", logoUrl:"",
  });
  const [selectedBrandId,setSelectedBrandId] = useState<string>("");

  const [products,setProducts] = useState([EMPTY_PRODUCT()]);

  const applyPreset = (preset) => {
    setBrandInfo(preset.brandInfo);
    setProducts(preset.products.map((p,i)=>({...p, id: Date.now()+i})));
    setSelectedBrandId("");
    setShowPresets(false);
  };

  const setBrand = (k,v) => setBrandInfo(b=>({...b,[k]:v}));
  const togglePlat = p => setBrandInfo(b=>({...b,platforms:b.platforms.includes(p)?b.platforms.filter(x=>x!==p):[...b.platforms,p]}));

  const setProduct = (id,k,v) => setProducts(ps=>ps.map(p=>p.id===id?{...p,[k]:v}:p));
  const addProduct = () => setProducts(ps=>[...ps, EMPTY_PRODUCT()]);
  const removeProduct = id => setProducts(ps=>ps.filter(p=>p.id!==id));

  const validate=()=>{
    const e={};
    if(!brandInfo.brandName.trim()) e.brandName="Required";
    if(!brandInfo.launchDate)       e.launchDate="Required";
    if(products.some(p=>!p.productName.trim())) e.products="Each product needs a name";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const generate=()=>{
    if(!validate()) return;
    setStep("loading");
    setTimeout(()=>{
      const plan = generateLaunchPlan(brandInfo, products);
      setResults(plan);
      const ts={};
      Object.entries(plan.tasks).forEach(([team,items])=>{
        items.forEach((_,i)=>{ts[`${team}-${i}`]=false;});
      });
      setTaskState(ts);
      const launchId = `launch-${Date.now()}`;
      setActiveLaunchId(launchId);
      const newLaunch = {
        id: launchId,
        label: `${brandInfo.collectionName||brandInfo.brandName}`,
        brandName: brandInfo.brandName,
        launchDate: brandInfo.launchDate,
        productCount: products.length,
        createdAt: new Date().toISOString(),
        results: plan,
        taskState: ts,
      };
      saveLaunches([...launches, newLaunch]);
      const firstPlatKey=Object.keys(plan.copy)[0];
      if(firstPlatKey) setSelPlat(firstPlatKey);
      setStep("results");
      setAR("tasks");
    },1600);
  };

  const toggleTask=key=>{
    setTaskState(s=>{
      const next={...s,[key]:!s[key]};
      if(activeLaunchId){
        const updated=launches.map(l=>l.id===activeLaunchId?{...l,taskState:next}:l);
        saveLaunches(updated);
      }
      return next;
    });
  };
  const reset=()=>{
    setStep("home");setResults({});setErrors({});setTaskState({});
    setImgPrompts({});setProducts([EMPTY_PRODUCT()]);setShowPresets(false);
    setActiveLaunchId(null);setSelectedBrandId("");
  };

  const taskProg=team=>{
    const items=results.tasks?.[team]||[];
    const done=items.filter((_,i)=>taskState[`${team}-${i}`]).length;
    return{done,total:items.length,pct:items.length?Math.round(done/items.length*100):0};
  };
  const allProg=()=>{
    const teams=Object.keys(results.tasks||{});
    const total=teams.reduce((a,t)=>a+(results.tasks[t]?.length||0),0);
    const done=teams.reduce((a,t)=>a+(results.tasks[t]?.filter((_,i)=>taskState[`${t}-${i}`]).length||0),0);
    return total?Math.round(done/total*100):0;
  };

  const IMG_TYPES=[
    {id:"mockup",      label:"Product Mockup"},
    {id:"social_feed", label:"Feed Post"},
    {id:"social_story",label:"Story / Reel"},
    {id:"lazada",      label:"Lazada Banner"},
    {id:"shopee",      label:"Shopee Banner"},
    {id:"tiktok",      label:"TikTok Thumb"},
  ];

  const genImagePrompt=async()=>{
    const product = products[selProd]||products[0];
    const inf = results.inferred?.[product.id]||{keyBenefit:"premium lifestyle product",targetCustomer:"lifestyle consumers"};
    const rawPrompt = buildImagePrompt(imgTab, product, brandInfo, inf);
    const key = `${product.id}-${imgTab}`;
    setImgLoading(true);
    try {
      const refined = await generateImage(rawPrompt);
      setImgPrompts(p=>({...p,[key]:refined}));
    } catch(e) {
      setImgPrompts(p=>({...p,[key]:rawPrompt}));
    }
    setImgLoading(false);
  };

  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#FAF7F4;color:#2A1A10;font-family:'DM Sans',sans-serif;}
    .app{min-height:100vh;background:#FAF7F4;}
    input[type=date]::-webkit-calendar-picker-indicator{filter:none;opacity:0.5;}

    /* ── TOPBAR ── */
    .topbar{
      padding:0 40px;border-bottom:1px solid #E8DDD5;
      display:flex;justify-content:space-between;align-items:stretch;
      background:#FFFFFF;position:sticky;top:0;z-index:100;
      box-shadow:0 1px 12px rgba(42,26,16,0.06);
    }
    .topbar-brand{display:flex;align-items:center;gap:0;border-right:1px solid #E8DDD5;padding-right:28px;margin-right:28px;}
    .topbar-accent{width:4px;height:36px;background:#CB0033;margin-right:14px;border-radius:2px;}
    .brand{font-family:'Playfair Display',serif;font-size:17px;color:#2A1A10;letter-spacing:0.02em;}
    .brand-sub{font-size:8px;letter-spacing:0.28em;color:#A08070;margin-top:2px;text-transform:uppercase;}
    .topbar-mid{display:flex;align-items:center;gap:6px;flex:1;}
    .topbar-tag{font-size:8px;letter-spacing:0.18em;color:#A08070;text-transform:uppercase;padding:4px 10px;border:1px solid #E8DDD5;background:#FAF7F4;border-radius:2px;}
    .topbar-right{display:flex;align-items:center;}

    /* ── FORM PAGE ── */
    .fw{max-width:720px;margin:0 auto;padding:48px 32px 80px;}
    .form-hero{margin-bottom:40px;}
    .form-eyebrow{font-size:9px;letter-spacing:0.3em;color:#CB0033;text-transform:uppercase;margin-bottom:10px;}
    .form-title{font-family:'Playfair Display',serif;font-size:36px;font-weight:400;color:#2A1A10;line-height:1.15;}
    .form-title em{color:#CB0033;font-style:italic;}
    .form-desc{font-size:12px;color:#A08070;margin-top:8px;letter-spacing:0.02em;}

    /* ── AUTOFILL BAR ── */
    .autofill-bar{
      display:flex;align-items:center;justify-content:space-between;
      margin-bottom:36px;padding:16px 20px;
      background:linear-gradient(135deg,#FFF5F7 0%,#FFF0EB 100%);
      border:1px solid #F2D0D8;border-left:3px solid #CB0033;
    }
    .autofill-label{font-size:11px;color:#6B4A38;}
    .autofill-label span{font-family:'Playfair Display',serif;font-size:14px;color:#2A1A10;font-style:italic;display:block;margin-top:2px;}
    .autofill-btn{
      padding:10px 20px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;
      letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;
      transition:all 0.18s;white-space:nowrap;border-radius:2px;
    }
    .autofill-btn:hover{background:#A8002A;box-shadow:0 4px 14px rgba(203,0,51,0.25);}

    /* ── FORM SECTIONS ── */
    .fsec{margin-bottom:32px;}
    .fsl{
      font-size:8px;letter-spacing:0.3em;color:#CB0033;text-transform:uppercase;
      margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #F2D0D8;
      display:flex;align-items:center;gap:10px;
    }
    .fsl-opt{font-size:7px;letter-spacing:0.18em;color:#A08070;background:#F4F0EC;padding:3px 8px;border:1px solid #E8DDD5;border-radius:2px;}

    .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
    .fg{display:flex;flex-direction:column;gap:5px;margin-bottom:4px;}
    .fg.full{grid-column:1/-1;}
    .fl{font-size:10px;font-weight:500;letter-spacing:0.08em;color:#6B4A38;}
    .fl .req{color:#CB0033;margin-left:2px;}

    .fi,.fsel{
      background:#FFFFFF;border:1.5px solid #E8DDD5;color:#2A1A10;
      font-family:'DM Sans',sans-serif;font-size:13px;padding:11px 13px;
      outline:none;transition:border-color 0.2s,box-shadow 0.2s;width:100%;
      border-radius:3px;
    }
    .fi:focus,.fsel:focus{border-color:#CB0033;box-shadow:0 0 0 3px rgba(203,0,51,0.08);}
    .fi::placeholder{color:#C4B0A0;}
    .fsel{cursor:pointer;}
    .ferr{font-size:10px;color:#CB0033;margin-top:3px;font-weight:500;}

    /* ── PRODUCT CARD ── */
    .prod-card{
      background:#FFFFFF;border:1.5px solid #E8DDD5;padding:22px;
      margin-bottom:16px;position:relative;animation:fu 0.25s ease;
      border-radius:4px;box-shadow:0 2px 8px rgba(42,26,16,0.04);
    }
    .prod-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}
    .prod-card-num{
      font-size:8px;letter-spacing:0.25em;color:#FFFFFF;text-transform:uppercase;
      background:#CB0033;padding:3px 10px;border-radius:2px;
    }
    .prod-card-name{font-family:'Playfair Display',serif;font-size:15px;color:#2A1A10;margin-left:10px;font-style:italic;}
    .remove-btn{
      padding:5px 12px;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;font-size:10px;letter-spacing:0.1em;cursor:pointer;
      font-family:'DM Sans',sans-serif;transition:all 0.18s;border-radius:2px;
    }
    .remove-btn:hover{border-color:#CB0033;color:#CB0033;}

    .add-prod-btn{
      width:100%;padding:14px;border:2px dashed #D6C8BC;background:#FAF7F4;
      color:#A08070;font-family:'DM Sans',sans-serif;font-size:11px;
      font-weight:500;letter-spacing:0.15em;text-transform:uppercase;
      cursor:pointer;transition:all 0.2s;margin-bottom:24px;border-radius:3px;
    }
    .add-prod-btn:hover{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}

    /* ── PLATFORM TAGS ── */
    .ptag-row{display:flex;flex-wrap:wrap;gap:8px;}
    .ptag{
      padding:8px 14px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .ptag.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .ptag:hover:not(.on){border-color:#A47860;color:#A47860;}

    /* ── GENERATE BUTTON ── */
    .gen-btn{
      width:100%;padding:17px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
      letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;
      margin-top:28px;transition:all 0.2s;border-radius:3px;
    }
    .gen-btn:hover{background:#A8002A;box-shadow:0 6px 20px rgba(203,0,51,0.3);}

    /* ── LOADING ── */
    .lw{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:82vh;gap:28px;}
    .llogo{font-family:'Playfair Display',serif;font-size:28px;color:#CB0033;letter-spacing:0.04em;}
    .lsub{font-size:9px;letter-spacing:0.28em;color:#A08070;text-transform:uppercase;}
    .lbar-bg{width:260px;height:3px;background:#E8DDD5;border-radius:2px;overflow:hidden;}
    .lbar{height:3px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:2px;animation:ls 1.5s ease-in-out infinite;}
    @keyframes ls{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}

    /* ── RESULTS LAYOUT ── */
    .rw{display:flex;min-height:calc(100vh - 65px);}

    /* Sidebar */
    .rsb{
      width:210px;border-right:1px solid #E8DDD5;padding:28px 0;
      background:#FFFFFF;flex-shrink:0;
    }
    .rsbl{font-size:8px;letter-spacing:0.28em;color:#A08070;padding:0 20px 12px;text-transform:uppercase;}

    /* Progress widget */
    .overall-prog{margin:0 16px 20px;padding:14px;background:#FAF7F4;border:1px solid #E8DDD5;border-radius:4px;}
    .op-label{font-size:9px;font-weight:500;letter-spacing:0.14em;color:#6B4A38;text-transform:uppercase;margin-bottom:8px;display:flex;justify-content:space-between;}
    .op-label span{color:#CB0033;font-family:'DM Mono',monospace;}
    .op-bar-bg{height:4px;background:#E8DDD5;border-radius:3px;}
    .op-bar{height:4px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:3px;transition:width 0.5s ease;}

    .rni{
      display:flex;align-items:center;gap:10px;padding:11px 20px;
      cursor:pointer;border-left:3px solid transparent;background:none;
      border-right:none;border-top:none;border-bottom:none;
      width:100%;text-align:left;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;
    }
    .rni:hover{background:#FAF7F4;}
    .rni.on{border-left-color:#CB0033;background:#FFF5F7;}
    .rni-icon{font-size:13px;}
    .rni-label{font-size:10px;font-weight:500;letter-spacing:0.06em;color:#A08070;}
    .rni.on .rni-label{color:#CB0033;}

    /* Main content */
    .rm{flex:1;padding:36px 44px;overflow-y:auto;background:#FAF7F4;}
    .rh{margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid #E8DDD5;}
    .rt{font-family:'Playfair Display',serif;font-size:30px;font-weight:400;color:#2A1A10;}
    .rt em{color:#CB0033;font-style:italic;}
    .rs{font-size:10px;letter-spacing:0.12em;color:#A08070;margin-top:5px;text-transform:uppercase;}

    /* ── INFERRED BANNER ── */
    .inf-banner{
      background:#FFF5F7;border:1px solid #F2D0D8;border-left:3px solid #CB0033;
      padding:14px 18px;margin-bottom:22px;animation:fu 0.3s ease;border-radius:0 4px 4px 0;
    }
    .inf-label{font-size:8px;letter-spacing:0.22em;color:#CB0033;text-transform:uppercase;margin-bottom:6px;font-weight:600;}
    .inf-txt{font-size:12px;color:#6B4A38;line-height:1.7;}

    /* ── TEAM / PLATFORM TABS ── */
    .ttabs{display:flex;gap:0;border-bottom:2px solid #E8DDD5;margin-bottom:22px;overflow-x:auto;background:#FFFFFF;border-radius:4px 4px 0 0;padding:0 4px;}
    .ttab{
      padding:12px 16px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:none;background:none;cursor:pointer;
      border-bottom:2px solid transparent;margin-bottom:-2px;
      font-family:'DM Sans',sans-serif;color:#A08070;transition:all 0.18s;
      white-space:nowrap;
    }
    .ttab:hover{color:#6B4A38;}
    .ttab.on{color:#2A1A10;}
    .ttab-prog{font-size:9px;margin-left:5px;font-family:'DM Mono',monospace;}

    /* ── TEAM PROGRESS ── */
    .team-prog-wrap{margin-bottom:18px;}
    .team-prog-meta{font-size:10px;font-weight:500;color:#6B4A38;margin-bottom:7px;display:flex;justify-content:space-between;}
    .team-prog-meta span{color:#CB0033;font-family:'DM Mono',monospace;}
    .team-prog-bar{height:3px;background:#E8DDD5;border-radius:2px;}
    .team-prog-fill{height:3px;background:linear-gradient(90deg,#CB0033,#A47860);border-radius:2px;transition:width 0.4s ease;}

    /* ── WEEK LABELS ── */
    .wk-label{
      font-size:9px;font-weight:600;letter-spacing:0.22em;color:#CB0033;
      text-transform:uppercase;margin:22px 0 10px;padding:8px 14px;
      background:#FFF5F7;border-left:3px solid #CB0033;border-radius:0 3px 3px 0;
    }
    .wk-label:first-child{margin-top:0;}

    /* ── CHECKLIST ITEMS ── */
    .chk-item{
      display:flex;align-items:flex-start;gap:12px;padding:13px 16px;
      background:#FFFFFF;border:1.5px solid #E8DDD5;margin-bottom:6px;
      cursor:pointer;transition:all 0.18s;user-select:none;border-radius:4px;
    }
    .chk-item:hover{border-color:#A47860;box-shadow:0 2px 8px rgba(164,120,96,0.1);}
    .chk-item.done-item{opacity:0.5;background:#FAF7F4;}
    .chk-box{
      width:18px;height:18px;border:2px solid #D6C8BC;border-radius:4px;
      flex-shrink:0;margin-top:1px;display:flex;align-items:center;
      justify-content:center;transition:all 0.18s;background:#FFFFFF;
    }
    .chk-item:hover .chk-box{border-color:#A47860;}
    .chk-item.done-item .chk-box{background:#CB0033;border-color:#CB0033;}
    .chk-tick{color:#FFFFFF;font-size:10px;display:none;font-weight:700;}
    .chk-item.done-item .chk-tick{display:block;}
    .chk-body{flex:1;}
    .chk-txt{font-size:13px;color:#2A1A10;line-height:1.55;}
    .chk-item.done-item .chk-txt{text-decoration:line-through;color:#A08070;}
    .chk-meta{display:flex;align-items:center;gap:10px;margin-top:5px;}
    .chk-owner{font-size:10px;color:#A08070;font-weight:500;}
    .chk-pri{font-size:8px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;padding:2px 8px;border:1.5px solid;border-radius:2px;}

    /* ── BRIEF CARD ── */
    .bcard{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:28px;animation:fu 0.28s ease;border-radius:4px;box-shadow:0 2px 12px rgba(42,26,16,0.05);}
    @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .bsl{font-size:8px;font-weight:700;letter-spacing:0.26em;color:#A08070;text-transform:uppercase;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #E8DDD5;}
    .bobj{font-family:'Playfair Display',serif;font-size:16px;color:#2A1A10;line-height:1.7;margin-bottom:22px;font-weight:400;}
    .b2col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:22px;}
    .blist{list-style:none;display:flex;flex-direction:column;gap:10px;}
    .blist li{display:flex;gap:10px;font-size:12px;line-height:1.55;color:#6B4A38;}
    .blist li::before{content:"▸";color:#CB0033;flex-shrink:0;font-size:11px;margin-top:1px;}
    .bdl{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border:1.5px solid #CB0033;font-size:10px;font-weight:600;letter-spacing:0.14em;color:#CB0033;border-radius:3px;}
    .bnote{margin-top:18px;padding:14px 16px;background:#FFF8F5;border-left:3px solid #A47860;font-size:12px;color:#6B4A38;line-height:1.65;border-radius:0 4px 4px 0;}

    /* ── COPY BLOCKS ── */
    .copy-prod-tabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px;}
    .copy-ptab{
      padding:7px 13px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .copy-ptab.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .cblock{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:20px;margin-bottom:12px;animation:fu 0.2s ease;border-radius:4px;}
    .cfl{font-size:8px;font-weight:700;letter-spacing:0.24em;color:#A08070;text-transform:uppercase;margin-bottom:8px;}
    .cfv{font-size:12px;color:#2A1A10;line-height:1.7;white-space:pre-wrap;}
    .ctrow{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px;}
    .ctag{font-size:10px;padding:4px 10px;background:#F4F0EC;color:#6B4A38;border-radius:3px;font-weight:500;}
    .csub{font-size:9px;font-weight:700;letter-spacing:0.2em;color:#CB0033;text-transform:uppercase;margin:18px 0 10px;padding-bottom:6px;border-bottom:1px solid #E8DDD5;}

    /* ── CALENDAR ── */
    .cal-theme{font-family:'Playfair Display',serif;font-size:18px;color:#2A1A10;margin-bottom:18px;animation:fu 0.25s ease;}
    .calday{display:flex;gap:14px;align-items:flex-start;padding:13px 0;border-bottom:1px solid #E8DDD5;}
    .calday:last-child{border-bottom:none;}
    .cd-day{font-size:9px;font-weight:600;letter-spacing:0.1em;color:#A08070;width:50px;flex-shrink:0;padding-top:2px;text-transform:uppercase;}
    .cd-team{font-size:10px;font-weight:500;color:#A47860;width:100px;flex-shrink:0;padding-top:2px;}
    .cd-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px;}
    .cd-action{font-size:12px;color:#2A1A10;line-height:1.55;flex:1;}

    /* ── IMAGE PROMPTS ── */
    .img-top{display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap;}
    .img-type-btn{
      padding:8px 14px;font-size:10px;font-weight:500;letter-spacing:0.1em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;
      transition:all 0.18s;border-radius:3px;
    }
    .img-type-btn.on{border-color:#CB0033;color:#CB0033;background:#FFF5F7;}
    .img-prod-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;}
    .img-prod-btn{
      padding:7px 13px;font-size:10px;font-weight:500;letter-spacing:0.08em;
      text-transform:uppercase;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.18s;border-radius:3px;
    }
    .img-prod-btn.on{border-color:#A47860;color:#A47860;background:#FFF8F5;}
    .img-prompt-card{background:#FFFFFF;border:1.5px solid #E8DDD5;padding:24px;animation:fu 0.28s ease;border-radius:4px;box-shadow:0 2px 12px rgba(42,26,16,0.05);}
    .img-prompt-label{font-size:8px;font-weight:700;letter-spacing:0.22em;color:#A47860;text-transform:uppercase;margin-bottom:10px;}
    .img-prompt-text{font-size:12px;color:#2A1A10;line-height:1.75;white-space:pre-wrap;}
    .img-note{margin-top:16px;padding:14px 16px;background:#FFF5F7;border-left:3px solid #CB0033;font-size:11px;color:#6B4A38;line-height:1.65;border-radius:0 4px 4px 0;}
    .copy-prompt-btn{
      margin-top:14px;padding:10px 18px;border:1.5px solid #A47860;
      background:#FFFFFF;color:#A47860;font-family:'DM Sans',sans-serif;
      font-size:10px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;
      cursor:pointer;transition:all 0.18s;border-radius:3px;
    }
    .copy-prompt-btn:hover{background:#A47860;color:#FFFFFF;}
    .gen-img-btn{
      padding:12px 22px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
      letter-spacing:0.22em;text-transform:uppercase;cursor:pointer;
      transition:all 0.2s;margin-bottom:20px;border-radius:3px;
    }
    .gen-img-btn:hover{background:#A8002A;box-shadow:0 4px 14px rgba(203,0,51,0.25);}
    .gen-img-btn:disabled{opacity:0.4;cursor:not-allowed;}
    .img-loading{font-size:10px;font-weight:500;letter-spacing:0.18em;color:#A08070;text-transform:uppercase;padding:20px 0;}
    .img-empty{padding:40px 0;text-align:center;color:#C4B0A0;font-size:12px;letter-spacing:0.08em;}

    /* ── PRESET MODAL ── */
    .preset-overlay{position:fixed;inset:0;background:rgba(42,26,16,0.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;animation:fu 0.2s ease;}
    .preset-modal{background:#FFFFFF;border:1.5px solid #E8DDD5;max-width:540px;width:100%;max-height:82vh;overflow-y:auto;border-radius:6px;box-shadow:0 20px 60px rgba(42,26,16,0.2);}
    .preset-modal-header{padding:22px 26px;border-bottom:1px solid #E8DDD5;display:flex;justify-content:space-between;align-items:flex-start;background:#FAF7F4;border-radius:6px 6px 0 0;}
    .preset-modal-title{font-family:'Playfair Display',serif;font-size:20px;color:#2A1A10;}
    .preset-modal-sub{font-size:10px;color:#A08070;margin-top:3px;}
    .preset-close{background:#FFFFFF;border:1.5px solid #E8DDD5;color:#A08070;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;padding:7px 14px;cursor:pointer;transition:all 0.18s;border-radius:3px;}
    .preset-close:hover{border-color:#CB0033;color:#CB0033;}
    .preset-list{padding:18px;}
    .preset-card{background:#FAF7F4;border:1.5px solid #E8DDD5;padding:18px 20px;margin-bottom:12px;cursor:pointer;transition:all 0.18s;border-radius:4px;}
    .preset-card:hover{border-color:#CB0033;background:#FFF5F7;box-shadow:0 4px 12px rgba(203,0,51,0.08);}
    .preset-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
    .preset-card-name{font-family:'Playfair Display',serif;font-size:16px;color:#2A1A10;}
    .preset-card-count{font-size:8px;font-weight:700;letter-spacing:0.2em;color:#CB0033;text-transform:uppercase;padding:3px 10px;border:1.5px solid #CB0033;border-radius:2px;}
    .preset-products{display:flex;flex-wrap:wrap;gap:6px;}
    .preset-prod-tag{font-size:10px;padding:4px 10px;background:#F4F0EC;color:#6B4A38;border-radius:3px;font-weight:500;}
    .preset-date{font-size:10px;color:#A08070;margin-top:8px;}
    .use-preset-btn{
      width:100%;padding:11px;background:#CB0033;color:#FFFFFF;border:none;
      font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
      letter-spacing:0.22em;text-transform:uppercase;cursor:pointer;
      margin-top:14px;transition:all 0.2s;border-radius:3px;
    }
    .use-preset-btn:hover{background:#A8002A;}

    /* ── RESET BUTTON ── */
    .reset-btn{
      padding:9px 18px;border:1.5px solid #E8DDD5;background:#FFFFFF;
      color:#A08070;font-family:'DM Sans',sans-serif;font-size:10px;
      font-weight:500;letter-spacing:0.15em;text-transform:uppercase;
      cursor:pointer;transition:all 0.18s;border-radius:3px;
    }
    .reset-btn:hover{border-color:#CB0033;color:#CB0033;}

    /* ── ANIMATIONS ── */
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

    /* ── RESPONSIVE ── */
    @media(max-width:680px){
      .fgrid{grid-template-columns:1fr;} .b2col{grid-template-columns:1fr;}
      .rsb{width:50px;} .rni-label{display:none;} .rni{justify-content:center;padding:12px;}
      .rm{padding:20px 14px;} .fw{padding:28px 14px;}
      .topbar{padding:0 14px;}
      .topbar-tag{display:none;}
    }
  `;

  // ── HOME DASHBOARD ────────────────────────────────────────────────────────
  const EMPTY_BRAND = ()=>({
    id: `brand-${Date.now()}`,
    brandName:"", tagline:"", logoText:"", brandVoice:"", logoUrl:"", markUrl:"",
    colors:[
      {hex:"#CB0033",name:"Pantone 1935 C",role:"Primary"},
      {hex:"#A47860",name:"",role:"Secondary"},
      {hex:"#D6D2C4",name:"",role:"Accent"},
      {hex:"#F4F0EC",name:"",role:"Background"},
    ],
    fonts:[
      {name:"Playfair Display",role:"Display / Headlines",weights:"400, 500, 600",style:"Serif"},
      {name:"DM Sans",role:"Body / UI",weights:"300, 400, 500",style:"Sans-serif"},
    ],
    platforms:["Lazada","Shopee","TikTok Shop","Shopify"],
  });

  const saveBrands=(list:any[])=>{setSavedBrands(list);kvSet("sl-hub-brands",list);};

  if(step==="home") return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-accent"/>
          <div><div className="brand">Sunbeams Lifestyle</div><div className="brand-sub">Product Launch Hub</div></div>
        </div>
        <div className="topbar-mid">
          <span className="topbar-tag">All Channels</span>
          <span className="topbar-tag">2–4 Week Sprint</span>
        </div>
        <button className="new-launch-btn" onClick={()=>setStep("home")}>← ALL LAUNCHES</button>
      </div>
      <div className="fw" style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>

        {/* Tab header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
          <div style={{display:"flex",gap:0,borderBottom:`2px solid ${B.border}`}}>
            {[{id:"launches",label:"Launches"},{id:"brands",label:"Brand Identity"}].map(tab=>(
              <button key={tab.id} onClick={()=>{setHomeTab(tab.id as any);setBrandForm(null);}}
                style={{background:"none",border:"none",borderBottom:`2px solid ${homeTab===tab.id?B.primary:"transparent"}`,marginBottom:-2,padding:"10px 20px",fontSize:13,fontWeight:homeTab===tab.id?600:400,color:homeTab===tab.id?B.primary:B.muted,cursor:"pointer",letterSpacing:"0.04em",transition:"all 0.15s"}}>
                {tab.label}
              </button>
            ))}
          </div>
          {homeTab==="launches" && (
            <button onClick={()=>setStep("form")} style={{background:B.primary,color:"#fff",border:"none",borderRadius:6,padding:"10px 22px",fontSize:12,fontWeight:500,letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase"}}>+ New Launch</button>
          )}
          {homeTab==="brands" && !brandForm && (
            <button onClick={()=>setBrandForm(EMPTY_BRAND())} style={{background:B.primary,color:"#fff",border:"none",borderRadius:6,padding:"10px 22px",fontSize:12,fontWeight:500,letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase"}}>+ New Brand</button>
          )}
        </div>

        {/* ── LAUNCHES TAB ── */}
        {homeTab==="launches" && (<>
          {!kvLoaded && (
            <div style={{color:B.muted,fontSize:14,padding:"40px 0"}}>Loading launches…</div>
          )}
          {kvLoaded && launches.length===0 && (
            <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:12,padding:48,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:16}}>◈</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:B.text,marginBottom:8}}>No launches yet</div>
              <div style={{color:B.muted,fontSize:14,marginBottom:24}}>Generate your first launch plan to get started.</div>
              <button onClick={()=>setStep("form")} style={{background:B.primary,color:"#fff",border:"none",borderRadius:8,padding:"12px 28px",fontSize:13,fontWeight:500,letterSpacing:"0.08em",cursor:"pointer",textTransform:"uppercase"}}>
                + New Launch
              </button>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
            {launches.map(launch=>{
              const teams=Object.keys(launch.results?.tasks||{});
              const total=teams.reduce((a,t)=>a+(launch.results.tasks[t]?.length||0),0);
              const done=teams.reduce((a,t)=>a+(launch.results.tasks[t]?.filter((_:any,i:number)=>launch.taskState?.[`${t}-${i}`]).length||0),0);
              const pct=total?Math.round(done/total*100):0;
              return (
                <div key={launch.id} onClick={()=>openLaunch(launch)} style={{background:B.surface,border:`1.5px solid ${B.border}`,borderRadius:12,padding:24,cursor:"pointer",transition:"border-color 0.15s",position:"relative"}}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:B.text,flex:1,paddingRight:8}}>{launch.label}</div>
                    <button onClick={e=>deleteLaunch(launch.id,e)} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:16,padding:0,lineHeight:1}}>✕</button>
                  </div>
                  <div style={{color:B.muted,fontSize:12,marginBottom:4}}>{launch.brandName}</div>
                  <div style={{color:B.muted,fontSize:12,marginBottom:16}}>{launch.productCount} product{launch.productCount>1?"s":""} · {launch.launchDate}</div>
                  <div style={{height:4,background:B.surfaceAlt,borderRadius:2,overflow:"hidden",marginBottom:8}}>
                    <div style={{height:"100%",width:`${pct}%`,background:B.primary,borderRadius:2,transition:"width 0.3s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                    <span style={{color:B.muted}}>{done} of {total} tasks done</span>
                    <span style={{color:pct===100?"#22a06b":B.primary,fontWeight:500}}>{pct}%</span>
                  </div>
                </div>
              );
            })}
            {kvLoaded && launches.length>0 && (
              <div onClick={()=>setStep("form")} style={{background:"transparent",border:`1.5px dashed ${B.border}`,borderRadius:12,padding:24,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:160,transition:"border-color 0.15s"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
                <div style={{fontSize:24,color:B.muted,marginBottom:8}}>+</div>
                <div style={{color:B.muted,fontSize:13}}>New Launch</div>
              </div>
            )}
          </div>
        </>)}

        {/* ── BRANDS TAB ── */}
        {homeTab==="brands" && (<>
          {brandForm!==null ? (()=>{
            const bf=brandForm;
            const setBF=(k:string,v:any)=>setBrandForm((b:any)=>({...b,[k]:v}));
            const setColor=(i:number,k:string,v:string)=>setBrandForm((b:any)=>{const c=[...b.colors];c[i]={...c[i],[k]:v};return{...b,colors:c};});
            const setColorMulti=(i:number,fields:Record<string,string>)=>setBrandForm((b:any)=>{const c=[...b.colors];c[i]={...c[i],...fields};return{...b,colors:c};});
            const setFont=(i:number,k:string,v:string)=>setBrandForm((b:any)=>{const f=[...b.fonts];f[i]={...f[i],[k]:v};return{...b,fonts:f};});
            const setFontMulti=(i:number,fields:Record<string,string>)=>setBrandForm((b:any)=>{const f=[...b.fonts];f[i]={...f[i],...fields};return{...b,fonts:f};});
            const isEdit=savedBrands.some((b:any)=>b.id===bf.id);

            // Parse font metadata from filename e.g. "Playfair-Display-Bold-Italic.ttf"
            const parseFontFilename=(filename:string)=>{
              const base=filename.replace(/\.(ttf|otf)$/i,"").replace(/[-_]/g," ");
              const weightMap:Record<string,string>={thin:"100",extralight:"200",light:"300",regular:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"};
              const styleKeywords=["italic","oblique"];
              const words=base.toLowerCase().split(" ");
              const detectedWeights:string[]=[];
              let isItalic=false;
              let nameParts:string[]=[];
              words.forEach(w=>{
                if(weightMap[w]){detectedWeights.push(weightMap[w]);}
                else if(styleKeywords.includes(w)){isItalic=true;}
                else{nameParts.push(w.charAt(0).toUpperCase()+w.slice(1));}
              });
              const name=nameParts.join(" ")||base;
              const weights=detectedWeights.length?detectedWeights.join(", "):"400";
              const style=isItalic?"Script":"Sans-serif";
              return{name,weights,style};
            };

            // Pantone Solid Coated → hex lookup table (authoritative values)
            const PANTONE_HEX: Record<string,string> = {
              "100 C":"#F4ED7C","101 C":"#F4ED47","102 C":"#F9E814","103 C":"#C6AD0F","104 C":"#AD9A0A","105 C":"#827612","106 C":"#F5E836","107 C":"#F5E122","108 C":"#F7D900","109 C":"#F9CC00","110 C":"#D4AA00","111 C":"#A07800","112 C":"#8C6800",
              "113 C":"#F5E152","114 C":"#F7DA2E","115 C":"#F7CC00","116 C":"#FFAE00","117 C":"#C48E00","118 C":"#A07800","119 C":"#7A5C00",
              "120 C":"#F7DC6C","121 C":"#F7D34A","122 C":"#FCC62D","123 C":"#FDB81E","124 C":"#E8A000","125 C":"#C08000","126 C":"#9A6600",
              "127 C":"#F2DE7C","128 C":"#EDD257","129 C":"#E8C034","130 C":"#E8A800","131 C":"#CC8C00","132 C":"#A06800","133 C":"#6E4800",
              "134 C":"#FAD87C","135 C":"#FAC857","136 C":"#F5B430","137 C":"#F0A000","138 C":"#CC8000","139 C":"#A06000","140 C":"#5E3800",
              "141 C":"#F2D680","142 C":"#F0C34A","143 C":"#EDAC22","144 C":"#E88C00","145 C":"#CC7800","146 C":"#A05C00","147 C":"#6E4200",
              "148 C":"#FAD9A8","149 C":"#FAC884","150 C":"#F5AC52","151 C":"#F58020","152 C":"#D46800","153 C":"#AA5200","154 C":"#7A3A00",
              "155 C":"#F2DAB0","156 C":"#F5C278","157 C":"#EDA040","158 C":"#E87800","159 C":"#C46000","160 C":"#984800","161 C":"#5E3000",
              "162 C":"#FCC8A0","163 C":"#FCA870","164 C":"#FA8040","165 C":"#FA5A00","166 C":"#D45000","167 C":"#AA4000","168 C":"#6E2800",
              "169 C":"#FBB8A0","170 C":"#FC9474","171 C":"#FA6040","172 C":"#F44A00","173 C":"#CC4000","174 C":"#903000","175 C":"#602200",
              "176 C":"#FDB0A8","177 C":"#FC8878","178 C":"#FA5C52","179 C":"#E83020","180 C":"#C22C1C","181 C":"#8A2018","182 C":"#FABAB4",
              "183 C":"#FC8C8C","184 C":"#FC5C64","185 C":"#E8002C","186 C":"#CC0024","187 C":"#A8001E","188 C":"#7A0018",
              "189 C":"#FCA8B4","190 C":"#FC7C96","191 C":"#F54870","192 C":"#E80044","193 C":"#C40038","194 C":"#A0002E","195 C":"#780028",
              "196 C":"#F7BAC2","197 C":"#F58898","198 C":"#ED4C6C","199 C":"#D4002C","200 C":"#B80024","201 C":"#98001C","202 C":"#7A0018",
              "203 C":"#F7BCCA","204 C":"#F58CA4","205 C":"#EE5882","206 C":"#D4004C","207 C":"#AA003C","208 C":"#880030","209 C":"#680026",
              "210 C":"#FCACC8","211 C":"#FC7CAC","212 C":"#F44C8C","213 C":"#E40070","214 C":"#CC005C","215 C":"#A8004A","216 C":"#7C0038",
              "217 C":"#F7B8D4","218 C":"#F480B2","219 C":"#EC3C92","220 C":"#CC0068","221 C":"#AC0056","222 C":"#880044","223 C":"#F8ACD8",
              "224 C":"#F680C2","225 C":"#F040A0","226 C":"#E0008A","227 C":"#BC0074","228 C":"#960060","229 C":"#740050",
              "230 C":"#FAB4E0","231 C":"#F882CC","232 C":"#F44CB8","233 C":"#CC00A0","234 C":"#A80088","235 C":"#840070",
              "236 C":"#F8AEE2","237 C":"#F47ED2","238 C":"#EE44BE","239 C":"#E000A8","240 C":"#BC0090","241 C":"#9C0078","242 C":"#780060",
              "243 C":"#F4BAE8","244 C":"#EE8CD8","245 C":"#E454C4","246 C":"#CC00B4","247 C":"#B000A0","248 C":"#8C0084","249 C":"#680066",
              "250 C":"#EFBEED","251 C":"#E888E0","252 C":"#DC50D4","253 C":"#C000C4","254 C":"#A400AE","255 C":"#7E0090",
              "256 C":"#EBBCEA","257 C":"#D88ED8","258 C":"#B84CC4","259 C":"#8A009C","260 C":"#720086","261 C":"#5E0072","262 C":"#4C005E",
              "263 C":"#DCCCE8","264 C":"#C0A0DC","265 C":"#9A60CC","266 C":"#7C20B8","267 C":"#6200A0","268 C":"#500088","269 C":"#3C0068",
              "270 C":"#C4B4E0","271 C":"#A890D0","272 C":"#8864BC","273 C":"#4C1892","274 C":"#3E0C80","275 C":"#320870","276 C":"#280860",
              "277 C":"#BCCCE8","278 C":"#98ACD8","279 C":"#6080C4","280 C":"#002884","281 C":"#002074","282 C":"#001A60",
              "283 C":"#A8C8E8","284 C":"#7AACD8","285 C":"#3C7CC4","286 C":"#0038A8","287 C":"#003090","288 C":"#002878","289 C":"#001A5C",
              "290 C":"#C0D8F0","291 C":"#94C4E8","292 C":"#5CAAD8","293 C":"#0050B4","294 C":"#00428C","295 C":"#003474","296 C":"#002258",
              "297 C":"#9ACCE8","298 C":"#5CB8E4","299 C":"#00A0DC","300 C":"#0070C0","301 C":"#005CA8","302 C":"#004A88","303 C":"#003468",
              "304 C":"#9EDAF0","305 C":"#54C8EC","306 C":"#00B8EC","307 C":"#0084C8","308 C":"#006AA8","309 C":"#00528A","310 C":"#60CCEC",
              "311 C":"#1CC4E8","312 C":"#00B2DC","313 C":"#0098CC","314 C":"#0082B4","315 C":"#006898","316 C":"#004E74",
              "317 C":"#B4E8F0","318 C":"#7CD8EC","319 C":"#3EC8E4","320 C":"#00B2CC","321 C":"#0098B4","322 C":"#00809A","323 C":"#006880",
              "324 C":"#A8DDE0","325 C":"#6ECCD0","326 C":"#28BABC","327 C":"#00A0A0","328 C":"#008888","329 C":"#007070","330 C":"#005A5C",
              "331 C":"#AEEADC","332 C":"#7CDCCC","333 C":"#3CCCC0","334 C":"#00ACA0","335 C":"#008C84","336 C":"#006E6A","337 C":"#9ADEC8",
              "338 C":"#6AD4B8","339 C":"#2AC4A4","340 C":"#00A888","341 C":"#008870","342 C":"#006A58","343 C":"#005042",
              "344 C":"#A8DFC0","345 C":"#7ECFAA","346 C":"#4CC090","347 C":"#00A86C","348 C":"#008C58","349 C":"#007044","350 C":"#005030",
              "351 C":"#B4E8C4","352 C":"#8CDCAC","353 C":"#5CCC90","354 C":"#00B464","355 C":"#009450","356 C":"#007840","357 C":"#00582C",
              "358 C":"#B0E0A8","359 C":"#90D490","360 C":"#5CC468","361 C":"#1EB44C","362 C":"#18983C","363 C":"#1A7C30","364 C":"#1A6024",
              "365 C":"#CCE8A4","366 C":"#B2DC80","367 C":"#92CC58","368 C":"#64B42C","369 C":"#549818","370 C":"#487C10","371 C":"#3A6010",
              "372 C":"#D8EE96","373 C":"#C8E870","374 C":"#B0DC44","375 C":"#8CC800","376 C":"#78AA00","377 C":"#607800","378 C":"#4A5E00",
              "379 C":"#E0EC6C","380 C":"#D0E440","381 C":"#B8D400","382 C":"#9EC400","383 C":"#869800","384 C":"#6A7A00","385 C":"#526000",
              "386 C":"#E8F060","387 C":"#DCEC30","388 C":"#CCDC00","389 C":"#B8C800","390 C":"#A0AC00","391 C":"#848C00","392 C":"#686E00",
              "393 C":"#F0F07C","394 C":"#EAE834","395 C":"#E0D800","396 C":"#CCB800","397 C":"#B09A00","398 C":"#907A00","399 C":"#745E00",
              "400 C":"#C4B8A8","401 C":"#B4A898","402 C":"#A49888","403 C":"#907E6C","404 C":"#786858","405 C":"#605040",
              "406 C":"#C8BCAC","407 C":"#B8A898","408 C":"#A49484","409 C":"#8C7868","410 C":"#746055","411 C":"#5A4840","412 C":"#3A2C24",
              "413 C":"#C4C0B4","414 C":"#B4B0A4","415 C":"#A09C8C","416 C":"#8C887A","417 C":"#767268","418 C":"#5A5850","419 C":"#282620",
              "420 C":"#C8C8C0","421 C":"#B8B8B0","422 C":"#A8A8A0","423 C":"#949490","424 C":"#808080","425 C":"#646464","426 C":"#282828",
              "427 C":"#D0CCC8","428 C":"#C0BCB8","429 C":"#A8A8A4","430 C":"#909090","431 C":"#70706E","432 C":"#505050","433 C":"#303030",
              "434 C":"#D8C4BC","435 C":"#CCAAA4","436 C":"#B88E88","437 C":"#987068","438 C":"#785050","439 C":"#5C3C38","440 C":"#402828",
              "441 C":"#C4C8BC","442 C":"#ACAFA8","443 C":"#98999A","444 C":"#7A7C80","445 C":"#5A5C60","446 C":"#404244","447 C":"#2C2E30",
              "448 C":"#4A3C28","449 C":"#544430","450 C":"#5E4E38","451 C":"#8A7A52","452 C":"#A89870","453 C":"#C0B48C","454 C":"#D4CCA8",
              "455 C":"#6A5800","456 C":"#7C6C00","457 C":"#8C7C00","458 C":"#B0A040","459 C":"#C8BC68","460 C":"#DAD090","461 C":"#EAE4B8",
              "462 C":"#5E3C1C","463 C":"#6E4820","464 C":"#7E5428","465 C":"#9E7040","466 C":"#BC9464","467 C":"#D4B488","468 C":"#E8D0B0",
              "469 C":"#6C3018","470 C":"#863C20","471 C":"#A04C28","472 C":"#C47048","473 C":"#DC9870","474 C":"#ECC098","475 C":"#F5DCB8",
              "476 C":"#4A2820","477 C":"#5E3028","478 C":"#7A3C2C","479 C":"#A06050","480 C":"#C08A78","481 C":"#DAB8A8","482 C":"#EED4C4",
              "483 C":"#6A2820","484 C":"#8C2C1C","485 C":"#CC1C18","486 C":"#E87060","487 C":"#ECA090","488 C":"#F4C4B8","489 C":"#F8DCD8",
              "490 C":"#5C1824","491 C":"#781E28","492 C":"#9C2830","493 C":"#DC7880","494 C":"#E8A4A8","495 C":"#F2C8CC","496 C":"#F8E0E0",
              "497 C":"#4A1C28","498 C":"#641E2E","499 C":"#7E2236","500 C":"#C46074","501 C":"#D898A8","502 C":"#ECC0CC","503 C":"#F5D8E0",
              "504 C":"#54162C","505 C":"#701830","506 C":"#8E1E3C","507 C":"#D07494","508 C":"#E0A0B4","509 C":"#EEC8D4","510 C":"#F5DDE6",
              "511 C":"#541644","512 C":"#761C5A","513 C":"#942070","514 C":"#C864A4","515 C":"#DCB0CC","516 C":"#EDD4E4","517 C":"#F5E8F0",
              "518 C":"#481A50","519 C":"#5E1C66","520 C":"#78207C","521 C":"#B470C0","522 C":"#CBB0D8","523 C":"#DDD0E8","524 C":"#EDE4F4",
              "525 C":"#4A1060","526 C":"#620C7C","527 C":"#7E0E98","528 C":"#B46CC8","529 C":"#D0ACDC","530 C":"#E2CCEA","531 C":"#EEE0F4",
              "532 C":"#2A1A3E","533 C":"#361E54","534 C":"#3E2066","535 C":"#8878B8","536 C":"#B0A8D0","537 C":"#CCCAE8","538 C":"#E4E2F4",
              "539 C":"#00264C","540 C":"#003060","541 C":"#003A78","542 C":"#5490C8","543 C":"#90B8DC","544 C":"#C0D8EC","545 C":"#DCE8F4",
              "546 C":"#002838","547 C":"#003450","548 C":"#003E64","549 C":"#6CAAC8","550 C":"#9CCAD8","551 C":"#C4E0EC","552 C":"#DCEEF6",
              "553 C":"#003028","554 C":"#003C30","555 C":"#004838","556 C":"#6EB0A0","557 C":"#A0CCB8","558 C":"#C4DED4","559 C":"#DCF0E8",
              "560 C":"#003028","561 C":"#003C30","562 C":"#00544A","563 C":"#70BAA8","564 C":"#A4D0C4","565 C":"#CCDEDE","566 C":"#DEEEE8",
              "567 C":"#003828","568 C":"#004838","569 C":"#006050","570 C":"#76C4B0","571 C":"#B0D8CC","572 C":"#CEEAE0","573 C":"#E4F4EE",
              "574 C":"#3A4C00","575 C":"#4A6000","576 C":"#5C7800","577 C":"#96B040","578 C":"#BAD070","579 C":"#CEDE9C","580 C":"#E4EEBF",
              "581 C":"#4A4C00","582 C":"#5E6000","583 C":"#7C8000","584 C":"#ACAC28","585 C":"#C8C84C","586 C":"#DCDC80","587 C":"#ECECB8",
              "600 C":"#F5E87C","601 C":"#F7E45A","602 C":"#F9DC2E","603 C":"#FAD000","604 C":"#F5C000","605 C":"#EEA800","606 C":"#E09000",
              "607 C":"#F2E898","608 C":"#F0E27C","609 C":"#ECD84E","610 C":"#E8CC28","611 C":"#E0B800","612 C":"#CCA000","613 C":"#B08400",
              "614 C":"#EEE4A0","615 C":"#E8D880","616 C":"#E2CC5C","617 C":"#D8BC30","618 C":"#C8A800","619 C":"#A88800","620 C":"#847000",
              "621 C":"#C8D8CC","622 C":"#B0C4BC","623 C":"#90ACA4","624 C":"#6C9088","625 C":"#4E7870","626 C":"#346058","627 C":"#1C4038",
              "628 C":"#C4E4EE","629 C":"#A0D4E8","630 C":"#6EC4E0","631 C":"#2AAED4","632 C":"#0094C4","633 C":"#007AB0","634 C":"#005E9C",
              "635 C":"#A8DCF0","636 C":"#7CCEF0","637 C":"#40BCEA","638 C":"#00A8E0","639 C":"#0090D0","640 C":"#0078BC","641 C":"#0064A8",
              "642 C":"#C4D8E8","643 C":"#B0C8DC","644 C":"#8CAEC8","645 C":"#6494B4","646 C":"#4A7CA0","647 C":"#36668A","648 C":"#1E4872",
              "649 C":"#D0D8E8","650 C":"#BAC8DC","651 C":"#9AB0CC","652 C":"#7494B8","653 C":"#4A6E98","654 C":"#2A4E78","655 C":"#0E2E58",
              "656 C":"#D4DCF0","657 C":"#C0CCEA","658 C":"#A0B4E0","659 C":"#7898D0","660 C":"#4C72BC","661 C":"#2852A4","662 C":"#0A3488",
              "663 C":"#E4D0E4","664 C":"#DABED8","665 C":"#C8A4C8","666 C":"#AC84B4","667 C":"#8C649A","668 C":"#6E4880","669 C":"#502C64",
              "670 C":"#F2D4E0","671 C":"#ECBAD4","672 C":"#E498C4","673 C":"#D87AB4","674 C":"#C85CA0","675 C":"#B44088","676 C":"#8E2468",
              "677 C":"#F0CCDA","678 C":"#EAB8CC","679 C":"#E0A0BC","680 C":"#CE82A8","681 C":"#BC5E90","682 C":"#A43A74","683 C":"#841858",
              "684 C":"#F0C0D4","685 C":"#EAAAC4","686 C":"#E090B4","687 C":"#CC70A0","688 C":"#B84E8A","689 C":"#9E2C6E","690 C":"#7A0C50",
              "691 C":"#F4C8CC","692 C":"#EEACB4","693 C":"#E48E9C","694 C":"#D46E82","695 C":"#C04C64","696 C":"#A42C46","697 C":"#8C1030",
              "698 C":"#F8D0CC","699 C":"#F5BCBC","700 C":"#F0A0A8","701 C":"#E87E8C","702 C":"#D85870","703 C":"#C03254","704 C":"#A01038",
              "705 C":"#F8D8D4","706 C":"#F8C4BC","707 C":"#F4A8A4","708 C":"#EE8090","709 C":"#E05C74","710 C":"#CC3458","711 C":"#B41040",
              "712 C":"#FCC898","713 C":"#FCBC80","714 C":"#FCA860","715 C":"#F89040","716 C":"#F07218","717 C":"#D85E00","718 C":"#BE5200",
              "719 C":"#F4C898","720 C":"#EDBA7C","721 C":"#E8A456","722 C":"#DA8C30","723 C":"#CC7800","724 C":"#A86000","725 C":"#804A00",
              "726 C":"#F2CAAC","727 C":"#EBBC90","728 C":"#E0A870","729 C":"#CF9048","730 C":"#BC7820","731 C":"#9A5E00","732 C":"#7A4800",
              "801 C":"#00B4E8","802 C":"#54E040","803 C":"#FFE000","804 C":"#FF7010","805 C":"#F8283C","806 C":"#F4009A","807 C":"#D800C0",
              "808 C":"#00AABA","809 C":"#DCDC00","810 C":"#FFAA00","811 C":"#F85800","812 C":"#F2003A","813 C":"#D4009C","814 C":"#9C3FC0",
              "871 C":"#8C6A00","872 C":"#8A6400","873 C":"#846000","874 C":"#7E5C00","875 C":"#786000","876 C":"#746000","877 C":"#8C8C8C",
              "1205 C":"#F9E07A","1215 C":"#FAD256","1225 C":"#FAB81A","1235 C":"#FAA00A","1245 C":"#E08800","1255 C":"#C47800","1265 C":"#9E6000",
              "1345 C":"#FCC87C","1355 C":"#FCBA58","1365 C":"#FAA030","1375 C":"#F88000","1385 C":"#D46800","1395 C":"#AA5000","1405 C":"#7C3C00",
              "1485 C":"#FFA060","1495 C":"#FF7C30","1505 C":"#FA5C00","1515 C":"#F0845C","1525 C":"#E06040","1535 C":"#C04820","1545 C":"#882C00",
              "1555 C":"#FDBB98","1565 C":"#FC9C6C","1575 C":"#F87840","1585 C":"#F45C18","1595 C":"#D44A00","1605 C":"#AC3C00","1615 C":"#7A2A00",
              "1625 C":"#FCA890","1635 C":"#FA8E6C","1645 C":"#F87048","1655 C":"#F54C18","1665 C":"#D84000","1675 C":"#A83000","1685 C":"#782000",
              "1765 C":"#FDB0B8","1775 C":"#FC909C","1785 C":"#F85C74","1788 C":"#F2243C","1795 C":"#D81E30","1805 C":"#B01824","1815 C":"#84101A",
              "1817 C":"#5A1E18","1820 C":"#F8C0B8","1825 C":"#F09090","1830 C":"#E86870","1835 C":"#D84058","1845 C":"#C82048","1850 C":"#A21836","1855 C":"#781030",
              "1895 C":"#FCCCDA","1905 C":"#FBA8C0","1915 C":"#F87CA8","1925 C":"#E84884","1935 C":"#CC0052","1945 C":"#A80042","1955 C":"#880034",
              "2001 C":"#F4D47C","2002 C":"#F0C050","2003 C":"#E8A828","2004 C":"#D88C00","2005 C":"#BC7400","2006 C":"#9A5E00","2007 C":"#7A4800",
              "2010 C":"#FCC878","2011 C":"#FDB040","2012 C":"#F89400","2013 C":"#E07800","2014 C":"#C06200","2015 C":"#9A4E00","2016 C":"#7C3C00",
              "2017 C":"#FFC845","2018 C":"#FFAA00","2019 C":"#F08C00","2020 C":"#CC7000","2021 C":"#A85800","2022 C":"#864400",
              "2038 C":"#F5E040","2039 C":"#F0D000","2040 C":"#E0B800","2041 C":"#C89800","2042 C":"#A87800","2043 C":"#886000","2044 C":"#6A4800",
              "2050 C":"#FC7E00","2051 C":"#E86C00","2052 C":"#CC5800","2053 C":"#B04800","2054 C":"#943800","2055 C":"#782C00","2056 C":"#5E2200",
              "2075 C":"#F8DC00","2076 C":"#ECC800","2077 C":"#D8AA00","2078 C":"#BC8800","2079 C":"#986800","2080 C":"#784C00","2081 C":"#5C3600",
              "2905 C":"#BED8F0","2915 C":"#90C4E8","2925 C":"#5AACE0","2935 C":"#0076CC","2945 C":"#0060B4","2955 C":"#004A98","2965 C":"#003478",
              "2975 C":"#C2E0F4","2985 C":"#78CCEE","2995 C":"#00B0E8","3005 C":"#0090D0","3015 C":"#0078B8","3025 C":"#0062A0","3035 C":"#004C84",
              "3105 C":"#8CD8E8","3115 C":"#44CADC","3125 C":"#00B8D4","3135 C":"#009CBE","3145 C":"#0084A8","3155 C":"#006E90","3165 C":"#005878",
              "3242 C":"#5CD4C8","3252 C":"#28CCB8","3262 C":"#00BCA8","3272 C":"#00A898","3282 C":"#008C84","3292 C":"#007470","3302 C":"#005A58",
              "3305 C":"#005C50","3315 C":"#007868","3325 C":"#009880","3335 C":"#00B090","3345 C":"#00A87C","3355 C":"#00946C","3365 C":"#007A5A",
              "3375 C":"#70D0A8","3385 C":"#3CC49C","3395 C":"#00B084","3405 C":"#009870","3415 C":"#008060","3425 C":"#006A4E","3435 C":"#004E38",
              "3505 C":"#7EC8A8","3515 C":"#48C09C","3525 C":"#18B48C","3535 C":"#009E78","3545 C":"#008A66","3555 C":"#007254","3565 C":"#005A40",
              "3570 C":"#00C88C","3575 C":"#00BC84","3580 C":"#00A870","3585 C":"#00946E","3590 C":"#007A5C","3595 C":"#00624C","3600 C":"#004A3C",
              "3605 C":"#A8E4B4","3615 C":"#7AD8A0","3625 C":"#48C88C","3635 C":"#24B878","3645 C":"#009E60","3655 C":"#00884E","3665 C":"#00703E",
              "3935 C":"#F7F060","3945 C":"#F0E840","3955 C":"#ECD400","3965 C":"#E0BC00","3975 C":"#C49800","3985 C":"#A07800","3995 C":"#7E5C00",
              "4005 C":"#F4B87C","4015 C":"#F0A458","4025 C":"#E88C38","4035 C":"#DC7818","4045 C":"#CC6800","4055 C":"#A85400","4065 C":"#864000","4075 C":"#663200",
              "4085 C":"#F4B48C","4095 C":"#F0A070","4105 C":"#E88858","4115 C":"#DC7040","4125 C":"#CC5828","4135 C":"#B44018","4145 C":"#982C08",
              "4485 C":"#7A4800","4495 C":"#8E5C14","4505 C":"#A47020","4515 C":"#BC8A38","4525 C":"#D0A456","4535 C":"#E0BC74","4545 C":"#ECCC90",
              "4550 C":"#5E3C00","4555 C":"#745000","4560 C":"#8A6400","4565 C":"#A68030","4570 C":"#C09A50","4575 C":"#D4B46C","4580 C":"#E8CC90",
              "4625 C":"#4A2014","4635 C":"#6E3420","4645 C":"#94502E","4655 C":"#B87050","4665 C":"#D09078","4675 C":"#E4B09E","4685 C":"#F0CCBC",
              "4695 C":"#502028","4705 C":"#743040","4715 C":"#9C4858","4725 C":"#C06C78","4735 C":"#D89098","4745 C":"#ECCAB4","4755 C":"#F4DEC8",
              "4975 C":"#3C1018","4985 C":"#702840","4995 C":"#A8506C","5005 C":"#C8849A","5015 C":"#DEB0BC","5025 C":"#EED0D8","5035 C":"#F5E4EA",
              "5045 C":"#7A3858","5055 C":"#904468","5065 C":"#B86A8A","5075 C":"#CA8FA6","5085 C":"#DDB4C4","5095 C":"#ECCDD8","5105 C":"#F4E0EA",
              "5115 C":"#5A3050","5125 C":"#7A4468","5135 C":"#984E7A","5145 C":"#B47898","5155 C":"#CCA0B8","5165 C":"#DFC4D0","5175 C":"#ECD8E4",
              "5185 C":"#4E2C50","5195 C":"#6E3C68","5205 C":"#945080","5215 C":"#B68AA8","5225 C":"#CAA8C0","5235 C":"#DEC4D6","5245 C":"#EEDDEA",
              "5255 C":"#342058","5265 C":"#4A2870","5275 C":"#603480","5285 C":"#9070A8","5295 C":"#BAA4C4","5305 C":"#D4C4DC","5315 C":"#E8DCEC",
              "5395 C":"#1A2C40","5405 C":"#2E4458","5415 C":"#446070","5425 C":"#7892A4","5435 C":"#A8BCCA","5445 C":"#C8D4DC","5455 C":"#DEE8EC",
              "5467 C":"#1E3428","5477 C":"#2E4C3C","5487 C":"#446458","5497 C":"#7A9C8E","5507 C":"#AABEB6","5517 C":"#C8D8D0","5527 C":"#E0EAEA",
              "5535 C":"#253828","5545 C":"#3C5440","5555 C":"#547060","5565 C":"#8CAE9E","5575 C":"#B8CCBC","5585 C":"#D4E4D8","5595 C":"#E8F0EC",
              "5605 C":"#2C4428","5615 C":"#3E5C38","5625 C":"#587250","5635 C":"#8CAC84","5645 C":"#B4CAB0","5645 C":"#B4CAB0","5655 C":"#CCDCC8","5665 C":"#E0EDDA",
              "5743 C":"#485828","5753 C":"#586834","5763 C":"#687840","5773 C":"#8A9C68","5783 C":"#ACBC8C","5793 C":"#C4D0AA","5803 C":"#DCE0C4",
              "5815 C":"#40380C","5825 C":"#564C14","5835 C":"#706018","5845 C":"#8C7C28","5855 C":"#A89840","5865 C":"#C0B460","5875 C":"#D8CC8A",
              "7401 C":"#F6E0B4","7402 C":"#F4D88C","7403 C":"#F2CE6A","7404 C":"#F0C436","7405 C":"#EAB000","7406 C":"#E09800","7407 C":"#D08000",
              "7408 C":"#F0A000","7409 C":"#E88C00","7410 C":"#F8B07C","7411 C":"#F49C5C","7412 C":"#EE8440","7413 C":"#E86C28","7414 C":"#D85810","7415 C":"#C44808","7416 C":"#AA3C00",
              "7417 C":"#F07C64","7418 C":"#E86060","7419 C":"#D84848","7420 C":"#C43048","7421 C":"#9E1E38","7422 C":"#F7B4B4","7423 C":"#E87884","7424 C":"#D84460","7425 C":"#B82040","7426 C":"#9C1030","7427 C":"#840C24","7428 C":"#6A0820",
              "7429 C":"#E8A0B4","7430 C":"#E08AAC","7431 C":"#CC60A8","7432 C":"#B83898","7433 C":"#A41C88","7434 C":"#8C0078","7435 C":"#700064",
              "7436 C":"#EAB8E0","7437 C":"#D490CC","7438 C":"#BE68B8","7439 C":"#A840A4","7440 C":"#8E1C90","7441 C":"#74007C","7442 C":"#5E0068",
              "7443 C":"#D8CCEC","7444 C":"#B8A0D8","7445 C":"#9878C4","7446 C":"#7850B0","7447 C":"#5C2C9A","7448 C":"#480C84","7449 C":"#36006E",
              "7450 C":"#C8C4EC","7451 C":"#A8A4DC","7452 C":"#8884CC","7453 C":"#6860B8","7454 C":"#4840A4","7455 C":"#2C1C90","7456 C":"#180C78",
              "7457 C":"#BED8F4","7458 C":"#8CC0EC","7459 C":"#50A4E0","7460 C":"#0088D0","7461 C":"#0072BC","7462 C":"#005EA8","7463 C":"#004890",
              "7464 C":"#7CCCE0","7465 C":"#3CB8D0","7466 C":"#00A4C4","7467 C":"#008EB4","7468 C":"#0078A0","7469 C":"#00648C","7470 C":"#005078",
              "7471 C":"#92D8DC","7472 C":"#58C4C8","7473 C":"#28ACB0","7474 C":"#009498","7475 C":"#007C84","7476 C":"#006470","7477 C":"#004E58",
              "7478 C":"#A8DCC4","7479 C":"#70C8A8","7480 C":"#30B488","7481 C":"#00A070","7482 C":"#008A5E","7483 C":"#00744C","7484 C":"#005C3C",
              "7485 C":"#C4DEB8","7486 C":"#A4D098","7487 C":"#7CBE78","7488 C":"#50AA50","7489 C":"#3C9440","7490 C":"#307A32","7491 C":"#24601E",
              "7492 C":"#C8D880","7493 C":"#ACBC6C","7494 C":"#90A050","7495 C":"#748438","7496 C":"#5E6C24","7497 C":"#4C5618","7498 C":"#3A4010",
              "7499 C":"#F4E8B4","7500 C":"#EED89C","7501 C":"#E8CC84","7502 C":"#DCBC68","7503 C":"#C4A448","7504 C":"#AC8C30","7505 C":"#946C10",
              "7506 C":"#F4DEB8","7507 C":"#F0CC9C","7508 C":"#E8B87A","7509 C":"#DCA458","7510 C":"#C48A38","7511 C":"#AC7020","7512 C":"#946000",
              "7513 C":"#F0C8A0","7514 C":"#E8B488","7515 C":"#DCA070","7516 C":"#CC8858","7517 C":"#B87040","7518 C":"#9C5828","7519 C":"#804018",
              "7520 C":"#EEC8B4","7521 C":"#E4B49C","7522 C":"#D09A7C","7523 C":"#C07C60","7524 C":"#A86448","7525 C":"#904E34","7526 C":"#783820",
              "7527 C":"#E0D4C4","7528 C":"#D0C0AE","7529 C":"#C0AC9A","7530 C":"#AC9482","7531 C":"#907868","7532 C":"#745C50","7533 C":"#5A4038",
              "7534 C":"#E4DCCC","7535 C":"#D4C8B8","7536 C":"#C4B4A0","7537 C":"#B09C88","7538 C":"#947E6E","7539 C":"#786058","7540 C":"#5C4440",
              "7541 C":"#E0E8EC","7542 C":"#C4D4DC","7543 C":"#A8BEC8","7544 C":"#8CA4B0","7545 C":"#6C8A98","7546 C":"#4E6E7E","7547 C":"#304E5E",
              "7548 C":"#FAC200","7549 C":"#F8B000","7550 C":"#F0A000","7551 C":"#DC8C00","7552 C":"#BC7000","7553 C":"#9A5800","7554 C":"#7A4200",
              "7555 C":"#F0C840","7556 C":"#E8B820","7557 C":"#D8A400","7558 C":"#C29000","7559 C":"#A87800","7560 C":"#8A6000","7561 C":"#6E4C00",
              "7562 C":"#D0C264","7563 C":"#C4B44E","7564 C":"#B8A238","7565 C":"#A88E24","7566 C":"#8E7810","7567 C":"#746400","7568 C":"#5A5000",
              "7569 C":"#E8AC60","7570 C":"#E09A44","7571 C":"#D08030","7572 C":"#BC6A18","7573 C":"#A45400","7574 C":"#8A4400","7575 C":"#6E3400",
              "7576 C":"#E8986A","7577 C":"#E08056","7578 C":"#CC6840","7579 C":"#B85028","7580 C":"#A03C18","7581 C":"#882C0E","7582 C":"#6E2004",
              "7583 C":"#D4846C","7584 C":"#C86C58","7585 C":"#B85444","7586 C":"#A03C30","7587 C":"#8A2C20","7588 C":"#72200E","7589 C":"#5E1408",
              "7590 C":"#E8B0A0","7591 C":"#DC9888","7592 C":"#CC7E6E","7593 C":"#BA6258","7594 C":"#A84848","7595 C":"#943034","7596 C":"#7A2028",
              "7597 C":"#DC6844","7598 C":"#D05C38","7599 C":"#BE4A28","7600 C":"#A83C1C","7601 C":"#903010","7602 C":"#782608","7603 C":"#602000",
              "7604 C":"#F4BCAC","7605 C":"#F0A898","7606 C":"#E8907E","7607 C":"#DC7464","7608 C":"#CC584E","7609 C":"#B8403C","7610 C":"#9E2C2C",
              "7611 C":"#E8C8A8","7612 C":"#E0B890","7613 C":"#D4A07A","7614 C":"#C48864","7615 C":"#B0704C","7616 C":"#985834","7617 C":"#7C4020",
              "7618 C":"#B46450","7619 C":"#A05040","7620 C":"#8A3C30","7621 C":"#742C20","7622 C":"#601E14","7623 C":"#4E1408","7624 C":"#3E1000",
              "7625 C":"#E8885C","7626 C":"#D87040","7627 C":"#C05828","7628 C":"#A84010","7629 C":"#8E3000","7630 C":"#742400","7631 C":"#5A1800",
              "7632 C":"#DCA87C","7633 C":"#CC9464","7634 C":"#BC804C","7635 C":"#A86834","7636 C":"#906020","7637 C":"#784C0E","7638 C":"#5E3A00",
              "7639 C":"#D4A050","7640 C":"#C88C38","7641 C":"#B87A20","7642 C":"#A46A08","7643 C":"#885A00","7644 C":"#6E4800","7645 C":"#563800",
              "7646 C":"#C8946C","7647 C":"#B87C54","7648 C":"#A4643C","7649 C":"#8C4C28","7650 C":"#783818","7651 C":"#623008","7652 C":"#4E2400",
              "7653 C":"#E0B4A0","7654 C":"#D4A08A","7655 C":"#C48874","7656 C":"#B0705C","7657 C":"#985848","7658 C":"#804030","7659 C":"#682C1E",
              "7660 C":"#D4C4B4","7661 C":"#C4B0A4","7662 C":"#B09A90","7663 C":"#9A8480","7664 C":"#846A68","7665 C":"#6C5050","7666 C":"#564040",
              "7667 C":"#CCCCC0","7668 C":"#B8B4AC","7669 C":"#A4A098","7670 C":"#8C8880","7671 C":"#78746E","7672 C":"#60605A","7673 C":"#4C4C48",
              "7674 C":"#E4DCD4","7675 C":"#D4C8BC","7676 C":"#C0AEA4","7677 C":"#AC968A","7678 C":"#94786E","7679 C":"#7C5C54","7680 C":"#654440",
              "7681 C":"#C4D0DC","7682 C":"#A8B8C8","7683 C":"#8898B0","7684 C":"#687A98","7685 C":"#4C6082","7686 C":"#34486E","7687 C":"#1E305A",
              "7688 C":"#B8C8DC","7689 C":"#98B0CC","7690 C":"#7898B8","7691 C":"#5880A4","7692 C":"#3C6890","7693 C":"#26527C","7694 C":"#0C3C68",
              "7695 C":"#B0CCDC","7696 C":"#8CB4CC","7697 C":"#6898B8","7698 C":"#4480A4","7699 C":"#286890","7700 C":"#0E547C","7701 C":"#003C68",
              "7702 C":"#A0C8DC","7703 C":"#78B4D0","7704 C":"#489CC4","7705 C":"#0C84B8","7706 C":"#0070A8","7707 C":"#005C94","7708 C":"#004880",
              "7709 C":"#8CC4D8","7710 C":"#5EB4CC","7711 C":"#20A4C0","7712 C":"#0090B4","7713 C":"#007CA4","7714 C":"#006A90","7715 C":"#00587C",
              "7716 C":"#6CBCC4","7717 C":"#38ACBA","7718 C":"#009CB0","7719 C":"#0088A0","7720 C":"#00748E","7721 C":"#00607A","7722 C":"#004E68",
              "7723 C":"#00A8A8","7724 C":"#009898","7725 C":"#008888","7726 C":"#007878","7727 C":"#006868","7728 C":"#005858","7729 C":"#004848",
              "7730 C":"#78C8A8","7731 C":"#50BC98","7732 C":"#14AC88","7733 C":"#009876","7734 C":"#008064","7735 C":"#006A54","7736 C":"#005444",
              "7737 C":"#90CC80","7738 C":"#6EC068","7739 C":"#44B450","7740 C":"#169C38","7741 C":"#0A8428","7742 C":"#0A6C1C","7743 C":"#0A5614",
              "7744 C":"#A0CC60","7745 C":"#8CC048","7746 C":"#74B030","7747 C":"#5C9C18","7748 C":"#4A8408","7749 C":"#3A6C00","7750 C":"#2C5600",
              "7751 C":"#C4C058","7752 C":"#B8B440","7753 C":"#A8A428","7754 C":"#969410","7755 C":"#808000","7756 C":"#6A6C00","7757 C":"#545800",
              "7758 C":"#D4C840","7759 C":"#C8BC28","7760 C":"#B8AC10","7761 C":"#A49A00","7762 C":"#8C8400","7763 C":"#746E00","7764 C":"#5C5800",
              "7765 C":"#DCCC80","7766 C":"#D0BC64","7767 C":"#C4AC48","7768 C":"#B49830","7769 C":"#9A8018","7770 C":"#806808","7771 C":"#645200",
              "7772 C":"#C8C0A8","7773 C":"#B8B090","7774 C":"#A8A07C","7775 C":"#948C68","7776 C":"#7C7454","7777 C":"#665E3E","7778 C":"#50482C",
              // Additional commonly used Pantone colors
              "Black C":"#2B2B2C","Black 2 C":"#313131","Black 3 C":"#3B3B3B","Black 4 C":"#404040","Black 5 C":"#4D4D4D","Black 6 C":"#212121","Black 7 C":"#2D2D2D",
              "White":"#FFFFFF","Cool Gray 1 C":"#F2F0EB","Cool Gray 2 C":"#E8E6E1","Cool Gray 3 C":"#D9D9D6","Cool Gray 4 C":"#C8C9C7","Cool Gray 5 C":"#B7B8B6","Cool Gray 6 C":"#A7A8AA","Cool Gray 7 C":"#97999B","Cool Gray 8 C":"#888B8D","Cool Gray 9 C":"#75787B","Cool Gray 10 C":"#63666A","Cool Gray 11 C":"#53565A",
              "Warm Gray 1 C":"#F1EDEA","Warm Gray 2 C":"#EBE6E0","Warm Gray 3 C":"#E0DAD4","Warm Gray 4 C":"#D4CCC6","Warm Gray 5 C":"#C6BDB6","Warm Gray 6 C":"#B8ADA8","Warm Gray 7 C":"#A89990","Warm Gray 8 C":"#998880","Warm Gray 9 C":"#897770","Warm Gray 10 C":"#796560","Warm Gray 11 C":"#695650",
              "Process Blue C":"#0085CA","Process Cyan C":"#00A9E0","Process Magenta C":"#CC0066","Process Yellow C":"#FFD700","Reflex Blue C":"#001489","Rhodamine Red C":"#E40046","Rubine Red C":"#CE0058","Violet C":"#440099",
              "Green C":"#00AB84","Orange 021 C":"#FE5000","Red 032 C":"#EF3340","Yellow C":"#FEDD00","Yellow 012 C":"#FFD700","Blue 072 C":"#10069F",
            };

            const lookupPantoneHex=async(colorName:string,idx:number)=>{
              if(!colorName.trim()) return;
              // Normalize: trim, uppercase, then try exact match first
              const normalized = colorName.trim();
              // Try variations of the key
              const attempts = [
                normalized,
                normalized.toUpperCase(),
                // "566 C" from "Pantone 566 C"
                normalized.replace(/^pantone\s+/i,""),
                normalized.replace(/^pantone\s+/i,"").trim(),
                // With/without " C" suffix
                normalized.replace(/\s+C$/i,"")+" C",
                normalized.replace(/\s+C$/i,"").replace(/^pantone\s+/i,"")+" C",
              ];
              for(const attempt of attempts){
                const found = PANTONE_HEX[attempt] || PANTONE_HEX[attempt.replace(/\s+/g," ")];
                if(found){
                  setColorMulti(idx,{hex:found,lookingUp:""});
                  return;
                }
              }
              // Fuzzy: strip "Pantone" prefix and try again
              const stripped = normalized.replace(/^pantone\s+/i,"").trim();
              // Try case-insensitive scan
              const lower = stripped.toLowerCase();
              const entry = Object.entries(PANTONE_HEX).find(([k])=>k.toLowerCase()===lower || k.toLowerCase().replace(/\s+c$/,"")===lower.replace(/\s+c$/,""));
              if(entry){
                setColorMulti(idx,{hex:entry[1],lookingUp:""});
                return;
              }
              // Nothing found — leave hex unchanged, no error flash
              setColorMulti(idx,{lookingUp:""});
            };
            return (
              <div style={{maxWidth:640,margin:"0 auto"}}>
                <button onClick={()=>setBrandForm(null)} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24,padding:0}}>← All Brands</button>
                {/* Brand Identity */}
                <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Brand Identity</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                    <div>
                      <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Name <span style={{color:B.primary}}>*</span></label>
                      <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Quencha" value={bf.brandName} onChange={e=>setBF("brandName",e.target.value)}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Logo Text (Initials)</label>
                      <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Q" value={bf.logoText} onChange={e=>setBF("logoText",e.target.value)}/>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Tagline</label>
                    <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Hydration for the On-the-Go Lifestyle" value={bf.tagline} onChange={e=>setBF("tagline",e.target.value)}/>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Voice / Personality</label>
                    <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Fresh, energetic, lifestyle-driven" value={bf.brandVoice} onChange={e=>setBF("brandVoice",e.target.value)}/>
                  </div>
                  <div style={{marginBottom:0}}>
                    <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Logo <span style={{fontSize:10,color:B.dimText}}>(optional)</span></label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:4}}>URL / Drive Link</div>
                        <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. https://drive.google.com/..." value={bf.logoUrl} onChange={e=>setBF("logoUrl",e.target.value)}/>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:4}}>Upload File</div>
                        <label style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${B.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",background:bf.logoFile?B.surfaceAlt:B.surface}}>
                          <span style={{fontSize:13,color:bf.logoFile?B.text:B.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{bf.logoFile||"Choose file…"}</span>
                          <span style={{fontSize:10,color:B.primary,fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>BROWSE</span>
                          <input type="file" accept="image/*,.svg" style={{display:"none"}} onChange={e=>{
                            const file=e.target.files?.[0];
                            if(!file) return;
                            const reader=new FileReader();
                            reader.onload=ev=>setBF("logoFileData",ev.target?.result);
                            reader.readAsDataURL(file);
                            setBF("logoFile",file.name);
                          }}/>
                        </label>
                      </div>
                    </div>
                    {bf.logoFileData&&(
                      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                        <img src={bf.logoFileData} alt="logo preview" style={{height:36,maxWidth:120,objectFit:"contain",border:`1px solid ${B.border}`,borderRadius:4,padding:4,background:"#fff"}}/>
                        <button onClick={()=>{setBF("logoFile","");setBF("logoFileData","");}} style={{fontSize:10,color:B.muted,background:"none",border:"none",cursor:"pointer"}}>Remove</button>
                      </div>
                    )}
                  </div>
                  <div style={{marginTop:12}}>
                    <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Mark <span style={{fontSize:10,color:B.dimText}}>(optional — icon / symbol mark only)</span></label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:4}}>URL / Drive Link</div>
                        <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. https://drive.google.com/..." value={bf.markUrl||""} onChange={e=>setBF("markUrl",e.target.value)}/>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:4}}>Upload File</div>
                        <label style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${B.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",background:bf.markFile?B.surfaceAlt:B.surface}}>
                          <span style={{fontSize:13,color:bf.markFile?B.text:B.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{bf.markFile||"Choose file…"}</span>
                          <span style={{fontSize:10,color:B.primary,fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>BROWSE</span>
                          <input type="file" accept="image/*,.svg" style={{display:"none"}} onChange={e=>{
                            const file=e.target.files?.[0];
                            if(!file) return;
                            const reader=new FileReader();
                            reader.onload=ev=>setBF("markFileData",ev.target?.result);
                            reader.readAsDataURL(file);
                            setBF("markFile",file.name);
                          }}/>
                        </label>
                      </div>
                    </div>
                    {bf.markFileData&&(
                      <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                        <img src={bf.markFileData} alt="brand mark preview" style={{height:36,maxWidth:80,objectFit:"contain",border:`1px solid ${B.border}`,borderRadius:4,padding:4,background:"#fff"}}/>
                        <button onClick={()=>{setBF("markFile","");setBF("markFileData","");}} style={{fontSize:10,color:B.muted,background:"none",border:"none",cursor:"pointer"}}>Remove</button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Color Palette */}
                <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Color Palette</div>
                  {bf.colors.map((c:any,i:number)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 100px 28px",gap:8,alignItems:"center",marginBottom:10}}>
                      <div style={{width:36,height:36,borderRadius:4,background:c.hex,border:`1px solid ${B.border}`,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                        <input type="color" value={c.hex} onChange={e=>setColor(i,"hex",e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Hex Code</div>
                        <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={c.hex} onChange={e=>setColor(i,"hex",e.target.value)}/>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Color Name</div>
                        <div style={{position:"relative"}}>
                          <input style={{width:"100%",border:`1px solid ${c.lookingUp?B.primary:B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Pantone 1935 C" value={c.name} onChange={e=>setColor(i,"name",e.target.value)} onBlur={()=>lookupPantoneHex(c.name,i)}/>
                          {c.lookingUp&&<span style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",fontSize:9,color:B.primary}}>…</span>}
                        </div>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Role</div>
                        <select style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={c.role} onChange={e=>setColor(i,"role",e.target.value)}>
                          {["Primary","Secondary","Accent","Background","Other"].map(r=><option key={r}>{r}</option>)}
                        </select>
                      </div>
                      <button onClick={()=>setBrandForm((b:any)=>({...b,colors:b.colors.filter((_:any,j:number)=>j!==i)}))} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:14,padding:0}}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>setBrandForm((b:any)=>({...b,colors:[...b.colors,{hex:"#CCCCCC",name:"",role:"Other"}]}))} style={{fontSize:11,color:B.primary,background:"none",border:`1px dashed ${B.border}`,borderRadius:4,padding:"6px 16px",cursor:"pointer",width:"100%",marginTop:4}}>+ Add Color</button>
                </div>
                {/* Typography */}
                <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Typography</div>
                  {bf.fonts.map((f:any,i:number)=>(
                    <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<bf.fonts.length-1?`1px solid ${B.border}`:"none"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 28px",gap:8,alignItems:"end",marginBottom:8}}>
                        <div>
                          <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Font Name</div>
                          <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Playfair Display" value={f.name} onChange={e=>setFont(i,"name",e.target.value)}/>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Role</div>
                          <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="Display / Headlines" value={f.role} onChange={e=>setFont(i,"role",e.target.value)}/>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Weights</div>
                          <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="400, 500, 600" value={f.weights} onChange={e=>setFont(i,"weights",e.target.value)}/>
                        </div>
                        <div>
                          <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Style</div>
                          <select style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={f.style} onChange={e=>setFont(i,"style",e.target.value)}>
                            {["Serif","Sans-serif","Monospace","Display","Script"].map(s=><option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <button onClick={()=>setBrandForm((b:any)=>({...b,fonts:b.fonts.filter((_:any,j:number)=>j!==i)}))} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:14,padding:0,marginBottom:2}}>✕</button>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:B.muted,marginBottom:4}}>Font File (TTF / OTF)</div>
                        <label style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 10px",cursor:"pointer",background:f.fontFile?B.surfaceAlt:B.surface,width:"100%"}}>
                          <span style={{fontSize:11,color:f.fontFile?B.text:B.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{f.fontFile||"Upload .ttf or .otf file…"}</span>
                          <span style={{fontSize:10,color:B.primary,fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>BROWSE</span>
                          <input type="file" accept=".ttf,.otf,font/ttf,font/otf" style={{display:"none"}} onChange={e=>{
                            const file=e.target.files?.[0];
                            if(!file) return;
                            const reader=new FileReader();
                            reader.onload=ev=>{
                              const dataUrl=ev.target?.result as string;
                              const fontMeta=parseFontFilename(file.name);
                              const fontFaceName=fontMeta.name||file.name.replace(/\.[^.]+$/,"");
                              const fontFace=new FontFace(fontFaceName,`url(${dataUrl})`);
                              fontFace.load().then(ff=>{(document.fonts as any).add(ff);});
                              setFontMulti(i,{
                                fontFileData:dataUrl,
                                fontFile:file.name,
                                name:fontMeta.name,
                                weights:fontMeta.weights,
                                style:fontMeta.style,
                              });
                            };
                            reader.readAsDataURL(file);
                          }}/>
                        </label>
                        {f.fontFile&&<button onClick={()=>{setFont(i,"fontFile","");setFont(i,"fontFileData","");}} style={{fontSize:10,color:B.muted,background:"none",border:"none",cursor:"pointer",marginTop:4,padding:0}}>Remove file</button>}
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>setBrandForm((b:any)=>({...b,fonts:[...b.fonts,{name:"",role:"",weights:"",style:"Sans-serif",fontFile:"",fontFileData:""}]}))} style={{fontSize:11,color:B.primary,background:"none",border:`1px dashed ${B.border}`,borderRadius:4,padding:"6px 16px",cursor:"pointer",width:"100%",marginTop:4}}>+ Add Typeface</button>
                </div>
                {/* Preview */}
                <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:24}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Preview</div>
                  <div style={{display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:44,height:44,borderRadius:8,background:bf.colors[0]?.hex||B.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,fontFamily:"'Playfair Display',serif",overflow:"hidden",flexShrink:0}}>
                      {bf.logoFileData
                        ? <img src={bf.logoFileData} alt="logo" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                        : (bf.logoText||bf.brandName?.slice(0,2)||"SL")
                      }
                    </div>
                    <div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:B.text}}>{bf.brandName||"Brand Name"}</div>
                      <div style={{fontSize:11,color:B.muted,marginTop:2}}>{bf.tagline||"Brand tagline"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,marginTop:12}}>
                    {bf.colors.map((c:any,i:number)=>(
                      <div key={i} title={c.name||c.hex} style={{width:20,height:20,borderRadius:3,background:c.hex,border:`1px solid ${B.border}`}}/>
                    ))}
                  </div>

                </div>
                {/* Actions */}
                <div style={{display:"flex",justifyContent:"space-between",paddingBottom:40}}>
                  <button onClick={()=>setBrandForm(null)} style={{background:"none",border:`1px solid ${B.border}`,borderRadius:4,padding:"10px 20px",fontSize:12,color:B.muted,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>Cancel</button>
                  <button onClick={()=>{
                    if(!bf.brandName.trim()) return;
                    const updated=isEdit?savedBrands.map((b:any)=>b.id===bf.id?bf:b):[...savedBrands,bf];
                    saveBrands(updated);
                    setBrandForm(null);
                  }} style={{background:B.primary,color:"#fff",border:"none",borderRadius:4,padding:"10px 24px",fontSize:12,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
                    {isEdit?"Save Changes":"Create Brand"}
                  </button>
                </div>
              </div>
            );
          })() : (
            // Brand list
            <>
              {savedBrands.length===0?(
                <div onClick={()=>setBrandForm(EMPTY_BRAND())} style={{border:`1.5px dashed ${B.border}`,borderRadius:8,padding:40,textAlign:"center",cursor:"pointer",transition:"border-color 0.15s"}}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
                  <div style={{fontSize:24,color:B.muted,marginBottom:8}}>+</div>
                  <div style={{color:B.muted,fontSize:13}}>Add your first brand</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
                  {savedBrands.map((b:any)=>(
                    <div key={b.id} style={{background:B.surface,border:`1.5px solid ${B.border}`,borderRadius:8,padding:20,cursor:"pointer",transition:"border-color 0.15s",position:"relative"}}
                      onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                      onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}
                      onClick={()=>setBrandForm({...b})}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                        <div style={{width:36,height:36,borderRadius:6,background:b.colors[0]?.hex||B.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,fontFamily:"'Playfair Display',serif",flexShrink:0}}>
                          {b.logoText||b.brandName?.slice(0,2)||"SL"}
                        </div>
                        <div>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:500,color:B.text}}>{b.brandName}</div>
                          <div style={{fontSize:10,color:B.muted,marginTop:1}}>{b.tagline}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:4,marginBottom:8}}>
                        {b.colors.map((c:any,i:number)=>(
                          <div key={i} style={{width:16,height:16,borderRadius:2,background:c.hex,border:`1px solid ${B.border}`}}/>
                        ))}
                      </div>
                      <button onClick={e=>{e.stopPropagation();if(confirm("Delete brand?"))saveBrands(savedBrands.filter((x:any)=>x.id!==b.id));}} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:13,padding:0}}>✕</button>
                    </div>
                  ))}
                  <div onClick={()=>setBrandForm(EMPTY_BRAND())} style={{background:"transparent",border:`1.5px dashed ${B.border}`,borderRadius:8,padding:20,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:120,transition:"border-color 0.15s"}}
                    onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                    onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
                    <div style={{fontSize:20,color:B.muted,marginBottom:6}}>+</div>
                    <div style={{color:B.muted,fontSize:11}}>New Brand</div>
                  </div>
                </div>
              )}
            </>
          )}
        </>)}

      </div>
    </div>
    </>
  );

  // ── FORM ──────────────────────────────────────────────────────────────────
  if(step==="form") return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-accent"/>
          <div><div className="brand">Sunbeams Lifestyle</div><div className="brand-sub">Product Launch Hub</div></div>
        </div>
        <div className="topbar-mid">
          <span className="topbar-tag">All Channels</span>
          <span className="topbar-tag">2–4 Week Sprint</span>
        </div>
        <button className="new-launch-btn" onClick={()=>setStep("home")}>← All Launches</button>
      </div>
      <div className="fw">
        {/* Preset modal */}
        {showPresets&&(
          <div className="preset-overlay" onClick={()=>setShowPresets(false)}>
            <div className="preset-modal" onClick={e=>e.stopPropagation()}>
              <div className="preset-modal-header">
                <div>
                  <div className="preset-modal-title">Quick-Fill Templates</div>
                  <div className="preset-modal-sub">Select a template to auto-populate all fields</div>
                </div>
                <button className="preset-close" onClick={()=>setShowPresets(false)}>✕ Close</button>
              </div>
              <div className="preset-list">
                {DEMO_PRESETS.map((preset,i)=>(
                  <div key={i} className="preset-card">
                    <div className="preset-card-top">
                      <div className="preset-card-name">{preset.brandInfo.collectionName||preset.label}</div>
                      <span className="preset-card-count">{preset.products.length} Product{preset.products.length>1?"s":""}</span>
                    </div>
                    <div className="preset-products">
                      {preset.products.map((p,j)=>(
                        <span key={j} className="preset-prod-tag">{p.productName} · {p.category}</span>
                      ))}
                    </div>
                    <div className="preset-date">Launch in ~4 weeks · {preset.brandInfo.platforms.join(", ")}</div>
                    <button className="use-preset-btn" onClick={()=>applyPreset(preset)}>
                      ◈ &nbsp; Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="form-eyebrow">Sunbeams Lifestyle · Product Launch</div>
        <h1 className="form-title">Launch a <em>Collection</em></h1>
        <p className="form-desc">Fill in the details — key benefits &amp; audience auto-generated per product</p>

        {/* Auto-fill bar */}
        <div className="autofill-bar">
          <div className="autofill-label">
            Want to go faster?
            <span>Use a pre-filled template to generate instantly</span>
          </div>
          <button className="autofill-btn" onClick={()=>setShowPresets(true)}>
            ⚡ Auto-Fill Template
          </button>
        </div>

        {/* Collection-level */}
        <div className="fsec">
          <div className="fsl">Collection Details</div>
          <div className="fgrid">
            <div className="fg">
              <label className="fl">Brand <span className="req">*</span></label>
              {savedBrands.length===0 ? (
                <div style={{padding:"10px 13px",border:`1.5px solid ${B.border}`,borderRadius:3,fontSize:12,color:B.muted,background:B.surfaceAlt}}>
                  No brands saved yet —&nbsp;
                  <span style={{color:B.primary,cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setStep("home");setHomeTab("brands");}}>create a brand first</span>
                </div>
              ) : (
                <select className="fsel" value={selectedBrandId} onChange={e=>{
                  const id=e.target.value;
                  setSelectedBrandId(id);
                  if(!id){
                    setBrandInfo(b=>({...b,brandName:"",brandColors:"",brandTypeface:"",logoUrl:""}));
                    return;
                  }
                  const found=savedBrands.find((b:any)=>b.id===id);
                  if(!found) return;
                  // Build brandColors string only if real colors exist
                  const colorStr = found.colors?.length
                    ? found.colors.map((c:any)=>[c.hex,c.name].filter(Boolean).join(" ")).join(", ")
                    : "";
                  // Build typeface string only if real fonts exist
                  const typefaceStr = found.fonts?.length
                    ? found.fonts.map((f:any)=>f.name).filter(Boolean).join(", ")
                    : "";
                  setBrandInfo(b=>({
                    ...b,
                    brandName: found.brandName||"",
                    brandColors: colorStr,
                    brandTypeface: typefaceStr,
                    logoUrl: found.logoUrl||"",
                  }));
                }}>
                  <option value="">— Select a brand —</option>
                  {savedBrands.map((b:any)=>(
                    <option key={b.id} value={b.id}>{b.brandName}</option>
                  ))}
                </select>
              )}
              {errors.brandName&&<span className="ferr">{errors.brandName}</span>}
              {selectedBrandId&&(()=>{
                const b=savedBrands.find((x:any)=>x.id===selectedBrandId);
                if(!b) return null;
                return (
                  <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:5,background:b.colors?.[0]?.hex||B.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,fontFamily:"'Playfair Display',serif",flexShrink:0,overflow:"hidden"}}>
                      {b.logoFileData
                        ? <img src={b.logoFileData} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
                        : (b.logoText||b.brandName?.slice(0,2)||"SL")}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:500,color:B.text,fontFamily:"'Playfair Display',serif"}}>{b.brandName}</div>
                      {b.tagline&&<div style={{fontSize:10,color:B.muted}}>{b.tagline}</div>}
                    </div>
                    {b.colors?.length>0&&(
                      <div style={{display:"flex",gap:3}}>
                        {b.colors.map((c:any,i:number)=>(
                          <div key={i} style={{width:12,height:12,borderRadius:2,background:c.hex,border:`1px solid ${B.border}`}}/>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="fg">
              <label className="fl">Collection Name <span style={{color:"#5A3828",marginLeft:2}}>optional</span></label>
              <input className="fi" placeholder="e.g. Golden Hour" value={brandInfo.collectionName} onChange={e=>setBrand("collectionName",e.target.value)}/>
            </div>
            <div className="fg">
              <label className="fl">Launch Date <span className="req">*</span></label>
              <input className="fi" type="date" value={brandInfo.launchDate} onChange={e=>setBrand("launchDate",e.target.value)}/>
              {errors.launchDate&&<span className="ferr">{errors.launchDate}</span>}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="fsec">
          <div className="fsl">Products in this Collection</div>
          {errors.products&&<div style={{fontSize:10,color:B.primary,marginBottom:10,letterSpacing:"0.1em"}}>{errors.products}</div>}
          {products.map((p,idx)=>(
            <div key={p.id} className="prod-card">
              <div className="prod-card-header">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="prod-card-num">Product {idx+1}</span>
                  {p.productName&&<span className="prod-card-name">{p.productName}</span>}
                </div>
                {products.length>1&&<button className="remove-btn" onClick={()=>removeProduct(p.id)}>Remove</button>}
              </div>
              <div className="fgrid">
                <div className="fg">
                  <label className="fl">Product Name <span className="req">*</span></label>
                  <input className="fi" placeholder="e.g. Glow Serum" value={p.productName} onChange={e=>setProduct(p.id,"productName",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Category</label>
                  <select className="fsel" value={p.category} onChange={e=>setProduct(p.id,"category",e.target.value)}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Size / Capacity</label>
                  <input className="fi" placeholder="e.g. 30ml, 500g" value={p.size} onChange={e=>setProduct(p.id,"size",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Color</label>
                  <input className="fi" placeholder="e.g. Rose Gold, Ivory" value={p.color} onChange={e=>setProduct(p.id,"color",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Shape / Design</label>
                  <input className="fi" placeholder="e.g. Dropper bottle" value={p.shape} onChange={e=>setProduct(p.id,"shape",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Dimensions</label>
                  <input className="fi" placeholder="e.g. 12cm × 4cm" value={p.dimensions} onChange={e=>setProduct(p.id,"dimensions",e.target.value)}/>
                </div>
                <div className="fg full">
                  <label className="fl">Inclusions</label>
                  <input className="fi" placeholder="e.g. Serum, dropper, gift box, instruction card" value={p.inclusions} onChange={e=>setProduct(p.id,"inclusions",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Warranty Type</label>
                  <input className="fi" placeholder="e.g. Manufacturer warranty" value={p.warranty} onChange={e=>setProduct(p.id,"warranty",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Warranty Duration</label>
                  <input className="fi" placeholder="e.g. 1 year" value={p.warrantyDuration} onChange={e=>setProduct(p.id,"warrantyDuration",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Price Point</label>
                  <input className="fi" placeholder="e.g. RM 89" value={p.pricePoint} onChange={e=>setProduct(p.id,"pricePoint",e.target.value)}/>
                </div>
                <div className="fg">
                  <label className="fl">Special Offer</label>
                  <input className="fi" placeholder="e.g. 20% off launch" value={p.specialOffer} onChange={e=>setProduct(p.id,"specialOffer",e.target.value)}/>
                </div>
              </div>
            </div>
          ))}
          <button className="add-prod-btn" onClick={addProduct}>+ Add Another Product to this Collection</button>
        </div>

        {/* Channels */}
        <div className="fsec">
          <div className="fsl">Launch Channels</div>
          <div className="ptag-row">
            {PLATFORMS.map(p=>(
              <button key={p} className={`ptag ${brandInfo.platforms.includes(p)?"on":""}`} onClick={()=>togglePlat(p)}>{p}</button>
            ))}
          </div>
        </div>

        <button className="gen-btn" onClick={generate}>◈ &nbsp; Generate Full Launch Plan</button>
      </div>
    </div></>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if(step==="loading") return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar"><div><div className="brand">Sunbeams Lifestyle</div></div></div>
      <div className="lw">
        <div className="llogo">{brandInfo.collectionName||brandInfo.brandName}</div>
        <div className="lbar-bg"><div className="lbar"/></div>
        <div className="llabel">Building your launch plan…</div>
      </div>
    </div></>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  const navItems=[
    {id:"tasks",   icon:"◻",label:"Checklists"},
    {id:"briefs",  icon:"⬡",label:"Briefs"},
    {id:"copy",    icon:"▲",label:"Copy"},
    {id:"calendar",icon:"◈",label:"Calendar"},
  ];

  const prog=allProg();

  // tasks
  const renderTasks=()=>{
    const {done,total,pct}=taskProg(selTeam);
    const items=results.tasks?.[selTeam]||[];
    const grouped={};
    items.forEach((t,i)=>{const w=`Week ${t.week}`;(grouped[w]=grouped[w]||[]).push({...t,idx:i});});
    const mainInf=results.inferred?.[products[0]?.id]||{};
    return (
      <div>
        <div className="ttabs">
          {TEAMS.map(t=>{
            const {pct:p}=taskProg(t.id);
            return (
              <button key={t.id} className={`ttab ${selTeam===t.id?"on":""}`}
                style={selTeam===t.id?{borderBottomColor:t.color,color:t.color}:{}}
                onClick={()=>setSelTeam(t.id)}>
                {t.icon} {t.label}<span className="ttab-prog">{p}%</span>
              </button>
            );
          })}
        </div>
        <div className="team-prog-wrap">
          <div className="team-prog-meta"><span>{done} of {total} done</span><span>{pct}%</span></div>
          <div className="team-prog-bar"><div className="team-prog-fill" style={{width:`${pct}%`}}/></div>
        </div>
        {Object.entries(grouped).map(([wk,tItems])=>(
          <div key={wk}>
            <div className="wk-label">{wk}</div>
            {tItems.map(t=>{
              const key=`${selTeam}-${t.idx}`;
              const isDone=taskState[key];
              const pc=t.priority==="high"?"#CB0033":t.priority==="medium"?"#A47860":"#D6D2C4";
              return (
                <div key={key} className={`chk-item ${isDone?"done-item":""}`} onClick={()=>toggleTask(key)}>
                  <div className="chk-box"><span className="chk-tick">✓</span></div>
                  <div className="chk-body">
                    <div className="chk-txt">{t.task}</div>
                    <div className="chk-meta">
                      <span className="chk-owner">{t.owner}</span>
                      <span className="chk-pri" style={{color:pc,borderColor:pc}}>{t.priority}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // briefs
  const renderBriefs=()=>{
    const b=results.briefs?.[selTeam]; if(!b) return null;
    return (
      <div key={selTeam}>
        <div className="ttabs">
          {TEAMS.map(t=>(
            <button key={t.id} className={`ttab ${selTeam===t.id?"on":""}`}
              style={selTeam===t.id?{borderBottomColor:t.color,color:t.color}:{}}
              onClick={()=>setSelTeam(t.id)}>{t.icon} {t.label}</button>
          ))}
        </div>
        <div className="bcard">
          <div className="bsl">Objective</div>
          <div className="bobj">{b.objective}</div>
          <div className="b2col">
            <div><div className="bsl">Deliverables</div><ul className="blist">{(b.deliverables||[]).map((d,i)=><li key={i}>{d}</li>)}</ul></div>
            <div><div className="bsl">Guidelines</div><ul className="blist">{(b.guidelines||[]).map((g,i)=><li key={i}>{g}</li>)}</ul></div>
          </div>
          <div className="bdl">◷ &nbsp;Deadline: {b.deadline}</div>
          {b.notes&&<div className="bnote">Note — {b.notes}</div>}
        </div>
      </div>
    );
  };

  // copy
  const renderCopy=()=>{
    const platKeys=Object.keys(results.copy||{});
    const d=results.copy?.[selPlat]; if(!d) return null;
    const renderVal=(label,val)=>{
      if(!val) return null;
      if(Array.isArray(val)) return (
        <div className="cblock" key={label}><div className="cfl">{label}</div><div className="ctrow">{val.map((v,i)=><span key={i} className="ctag">{v}</span>)}</div></div>
      );
      if(typeof val==="object") return null;
      return <div className="cblock" key={label}><div className="cfl">{label}</div><div className="cfv">{val}</div></div>;
    };

    // Flatten nested product arrays into readable sections
    const renderPlatCopy=(data)=>{
      const sections=[];
      Object.entries(data).forEach(([k,v])=>{
        if(k==="products"&&Array.isArray(v)){
          v.forEach(prod=>{
            sections.push(<div key={prod.name} className="csub">— {prod.name}</div>);
            Object.entries(prod).filter(([kk])=>kk!=="name").forEach(([kk,vv])=>{
              sections.push(renderVal(kk.replace(/([A-Z])/g," $1").trim().toUpperCase(),vv));
            });
          });
        } else {
          sections.push(renderVal(k.replace(/([A-Z])/g," $1").trim().toUpperCase(),v));
        }
      });
      return sections;
    };

    return (
      <div>
        <div className="copy-prod-tabs">
          {platKeys.map(p=>(
            <button key={p} className={`copy-ptab ${selPlat===p?"on":""}`} onClick={()=>setSelPlat(p)}>
              {p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
        </div>
        <div key={selPlat} style={{animation:"fu 0.22s ease"}}>
          {renderPlatCopy(d)}
        </div>
      </div>
    );
  };

  // calendar
  const renderCalendar=()=>{
    const weeks=Object.keys(results.calendar||{});
    const w=results.calendar?.[selWeek]; if(!w) return null;
    return (
      <div>
        <div className="ttabs">
          {weeks.map(wk=>(
            <button key={wk} className={`ttab ${selWeek===wk?"on":""}`}
              style={selWeek===wk?{borderBottomColor:"#CB0033",color:"#CB0033"}:{}}
              onClick={()=>setSelWeek(wk)}>{wk.replace("week","Week ")}</button>
          ))}
        </div>
        <div className="cal-theme" key={selWeek}>{w.theme}</div>
        {(w.days||[]).map((d,i)=>(
          <div key={i} className="calday">
            <div className="cd-day">{d.day}</div>
            <div className="cd-team">{d.team}</div>
            <div className="cd-dot" style={{background:TypeColor[d.type]||"#A47860"}}/>
            <div className="cd-action" style={d.type==="launch"?{color:"#CB0033",fontWeight:500}:{}}>{d.action}</div>
          </div>
        ))}
      </div>
    );
  };

  // images
  const renderImages=()=>{
    const curProd=products[selProd]||products[0];
    const key=`${curProd.id}-${imgTab}`;
    const prompt=imgPrompts[key];
    return (
      <div>
        {/* Product selector */}
        {products.length>1&&(
          <div style={{marginBottom:14}}>
            <div className="cfl" style={{marginBottom:8}}>Select Product</div>
            <div className="img-prod-row">
              {products.map((p,i)=>(
                <button key={p.id} className={`img-prod-btn ${selProd===i?"on":""}`} onClick={()=>setSelProd(i)}>{p.productName||`Product ${i+1}`}</button>
              ))}
            </div>
          </div>
        )}

        {/* Image type */}
        <div className="cfl" style={{marginBottom:8}}>Image Type</div>
        <div className="img-top">
          {IMG_TYPES.map(t=>(
            <button key={t.id} className={`img-type-btn ${imgTab===t.id?"on":""}`} onClick={()=>setImgTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <button className="gen-img-btn" disabled={imgLoading} onClick={genImagePrompt}>
          {imgLoading?"Optimizing prompt…":"◈ Generate Image Prompt"}
        </button>

        {imgLoading&&<div className="img-loading">Crafting prompt for {curProd.productName}…</div>}

        {prompt&&!imgLoading&&(
          <div className="img-prompt-card">
            <div className="img-prompt-label">Optimized Image Prompt — {IMG_TYPES.find(t=>t.id===imgTab)?.label} · {curProd.productName}</div>
            <div className="img-prompt-text">{prompt}</div>
            <div className="img-note">
              Copy this prompt and paste it into your preferred AI image tool:<br/>
              <strong>Midjourney</strong> — paste in Discord with /imagine<br/>
              <strong>DALL·E / ChatGPT</strong> — paste directly<br/>
              <strong>Adobe Firefly</strong> — paste in Text to Image<br/>
              <strong>Ideogram</strong> — paste at ideogram.ai<br/>
              <strong>Canva AI</strong> — paste in Magic Media
            </div>
            <button className="copy-prompt-btn" onClick={()=>navigator.clipboard?.writeText(prompt)}>Copy Prompt</button>
          </div>
        )}

        {!prompt&&!imgLoading&&(
          <div style={{padding:"32px 0",textAlign:"center",color:"#5A3828",fontSize:11,letterSpacing:"0.12em"}}>
            Select a product and image type, then click Generate Prompt.
          </div>
        )}
      </div>
    );
  };

  const renderBrands=()=>{
    // Brand form view
    if(brandForm!==null){
      const bf=brandForm;
      const setBF=(k:string,v:any)=>setBrandForm((b:any)=>({...b,[k]:v}));
      const setColor=(i:number,k:string,v:string)=>setBrandForm((b:any)=>{const c=[...b.colors];c[i]={...c[i],[k]:v};return{...b,colors:c};});
      const setFont=(i:number,k:string,v:string)=>setBrandForm((b:any)=>{const f=[...b.fonts];f[i]={...f[i],[k]:v};return{...b,fonts:f};});
      const isEdit=savedBrands.some((b:any)=>b.id===bf.id);
      return (
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <button onClick={()=>setBrandForm(null)} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:24,padding:0}}>← All Brands</button>

          {/* Brand Identity */}
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Brand Identity</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <div>
                <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Name <span style={{color:B.primary}}>*</span></label>
                <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Quencha" value={bf.brandName} onChange={e=>setBF("brandName",e.target.value)}/>
              </div>
              <div>
                <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Logo Text (Initials)</label>
                <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Q" value={bf.logoText} onChange={e=>setBF("logoText",e.target.value)}/>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Tagline</label>
              <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Hydration for the On-the-Go Lifestyle" value={bf.tagline} onChange={e=>setBF("tagline",e.target.value)}/>
            </div>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Voice / Personality</label>
              <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:13,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Fresh, energetic, lifestyle-driven" value={bf.brandVoice} onChange={e=>setBF("brandVoice",e.target.value)}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Logo <span style={{fontSize:10,color:B.dimText}}>(optional)</span></label>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:6}}>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="URL / Drive link" value={bf.logoUrl} onChange={e=>setBF("logoUrl",e.target.value)}/>
                  <label style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${B.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",background:bf.logoFile?B.surfaceAlt:B.surface}}>
                    <span style={{fontSize:12,color:bf.logoFile?B.text:B.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{bf.logoFile||"Upload file…"}</span>
                    <span style={{fontSize:10,color:B.primary,fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>BROWSE</span>
                    <input type="file" accept="image/*,.svg" style={{display:"none"}} onChange={e=>{
                      const file=e.target.files?.[0]; if(!file) return;
                      const reader=new FileReader();
                      reader.onload=ev=>setBF("logoFileData",ev.target?.result);
                      reader.readAsDataURL(file); setBF("logoFile",file.name);
                    }}/>
                  </label>
                </div>
                {bf.logoFileData&&(
                  <div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}>
                    <img src={bf.logoFileData} alt="logo" style={{height:32,maxWidth:100,objectFit:"contain",border:`1px solid ${B.border}`,borderRadius:4,padding:3,background:"#fff"}}/>
                    <button onClick={()=>{setBF("logoFile","");setBF("logoFileData","");}} style={{fontSize:10,color:B.muted,background:"none",border:"none",cursor:"pointer"}}>Remove</button>
                  </div>
                )}
                <div style={{fontSize:10,color:B.dimText,marginTop:4}}>Full logo (wordmark or lockup)</div>
              </div>
              <div>
                <label style={{fontSize:11,color:B.muted,display:"block",marginBottom:4}}>Brand Mark <span style={{fontSize:10,color:B.dimText}}>(optional)</span></label>
                <div style={{display:"grid",gridTemplateColumns:"1fr",gap:6}}>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"8px 10px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="URL / Drive link" value={bf.markUrl||""} onChange={e=>setBF("markUrl",e.target.value)}/>
                  <label style={{display:"flex",alignItems:"center",gap:8,border:`1px solid ${B.border}`,borderRadius:4,padding:"7px 10px",cursor:"pointer",background:bf.markFile?B.surfaceAlt:B.surface}}>
                    <span style={{fontSize:12,color:bf.markFile?B.text:B.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{bf.markFile||"Upload file…"}</span>
                    <span style={{fontSize:10,color:B.primary,fontWeight:600,letterSpacing:"0.06em",flexShrink:0}}>BROWSE</span>
                    <input type="file" accept="image/*,.svg" style={{display:"none"}} onChange={e=>{
                      const file=e.target.files?.[0]; if(!file) return;
                      const reader=new FileReader();
                      reader.onload=ev=>setBF("markFileData",ev.target?.result);
                      reader.readAsDataURL(file); setBF("markFile",file.name);
                    }}/>
                  </label>
                </div>
                {bf.markFileData&&(
                  <div style={{marginTop:6,display:"flex",alignItems:"center",gap:8}}>
                    <img src={bf.markFileData} alt="mark" style={{height:32,maxWidth:60,objectFit:"contain",border:`1px solid ${B.border}`,borderRadius:4,padding:3,background:"#fff"}}/>
                    <button onClick={()=>{setBF("markFile","");setBF("markFileData","");}} style={{fontSize:10,color:B.muted,background:"none",border:"none",cursor:"pointer"}}>Remove</button>
                  </div>
                )}
                <div style={{fontSize:10,color:B.dimText,marginTop:4}}>Icon / symbol mark only</div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Color Palette</div>
            {bf.colors.map((c:any,i:number)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"40px 1fr 1fr 100px 28px",gap:8,alignItems:"center",marginBottom:10}}>
                <div style={{width:36,height:36,borderRadius:4,background:c.hex,border:`1px solid ${B.border}`,cursor:"pointer",position:"relative",overflow:"hidden"}}>
                  <input type="color" value={c.hex} onChange={e=>setColor(i,"hex",e.target.value)} style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%",height:"100%"}}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Hex Code</div>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={c.hex} onChange={e=>setColor(i,"hex",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Color Name</div>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Pantone 1935 C" value={c.name} onChange={e=>setColor(i,"name",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Role</div>
                  <select style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={c.role} onChange={e=>setColor(i,"role",e.target.value)}>
                    {["Primary","Secondary","Accent","Background","Other"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <button onClick={()=>setBrandForm((b:any)=>({...b,colors:b.colors.filter((_:any,j:number)=>j!==i)}))} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:14,padding:0}}>✕</button>
              </div>
            ))}
            <button onClick={()=>setBrandForm((b:any)=>({...b,colors:[...b.colors,{hex:"#CCCCCC",name:"",role:"Other"}]}))} style={{fontSize:11,color:B.primary,background:"none",border:`1px dashed ${B.border}`,borderRadius:4,padding:"6px 16px",cursor:"pointer",width:"100%",marginTop:4}}>+ Add Color</button>
          </div>

          {/* Typography */}
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:16}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Typography</div>
            {bf.fonts.map((f:any,i:number)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 28px",gap:8,alignItems:"end",marginBottom:12}}>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Font Name</div>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="e.g. Playfair Display" value={f.name} onChange={e=>setFont(i,"name",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Role</div>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="Display / Headlines" value={f.role} onChange={e=>setFont(i,"role",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Weights</div>
                  <input style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} placeholder="400, 500, 600" value={f.weights} onChange={e=>setFont(i,"weights",e.target.value)}/>
                </div>
                <div>
                  <div style={{fontSize:9,color:B.muted,marginBottom:2}}>Style</div>
                  <select style={{width:"100%",border:`1px solid ${B.border}`,borderRadius:4,padding:"6px 8px",fontSize:12,background:B.surface,color:B.text,outline:"none"}} value={f.style} onChange={e=>setFont(i,"style",e.target.value)}>
                    {["Serif","Sans-serif","Monospace","Display","Script"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={()=>setBrandForm((b:any)=>({...b,fonts:b.fonts.filter((_:any,j:number)=>j!==i)}))} style={{background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:14,padding:0,marginBottom:2}}>✕</button>
              </div>
            ))}
            <button onClick={()=>setBrandForm((b:any)=>({...b,fonts:[...b.fonts,{name:"",role:"",weights:"",style:"Sans-serif"}]}))} style={{fontSize:11,color:B.primary,background:"none",border:`1px dashed ${B.border}`,borderRadius:4,padding:"6px 16px",cursor:"pointer",width:"100%",marginTop:4}}>+ Add Typeface</button>
          </div>


          {/* Preview */}
          <div style={{background:B.surface,border:`1px solid ${B.border}`,borderRadius:8,padding:24,marginBottom:24}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.2em",color:B.primary,textTransform:"uppercase",marginBottom:16}}>Preview</div>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:8,background:bf.colors[0]?.hex||B.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:16,fontFamily:"'Playfair Display',serif"}}>
                {bf.logoText||bf.brandName?.slice(0,2)||"SL"}
              </div>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:500,color:B.text}}>{bf.brandName||"Brand Name"}</div>
                <div style={{fontSize:11,color:B.muted,marginTop:2}}>{bf.tagline||"Brand tagline"}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:6,marginTop:12}}>
              {bf.colors.map((c:any,i:number)=>(
                <div key={i} title={c.name||c.hex} style={{width:20,height:20,borderRadius:3,background:c.hex,border:`1px solid ${B.border}`}}/>
              ))}
            </div>
            {bf.platforms.length>0&&<div style={{display:"none"}}/>}
          </div>

          {/* Actions */}
          <div style={{display:"flex",justifyContent:"space-between",paddingBottom:40}}>
            <button onClick={()=>setBrandForm(null)} style={{background:"none",border:`1px solid ${B.border}`,borderRadius:4,padding:"10px 20px",fontSize:12,color:B.muted,cursor:"pointer",letterSpacing:"0.08em",textTransform:"uppercase"}}>Cancel</button>
            <button onClick={()=>{
              if(!bf.brandName.trim()) return;
              const updated=isEdit?savedBrands.map((b:any)=>b.id===bf.id?bf:b):[...savedBrands,bf];
              saveBrands(updated);
              setBrandForm(null);
            }} style={{background:B.primary,color:"#fff",border:"none",borderRadius:4,padding:"10px 24px",fontSize:12,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",cursor:"pointer"}}>
              {isEdit?"Save Changes":"Create Brand"}
            </button>
          </div>
        </div>
      );
    }

    // Brand list view
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <div style={{fontSize:11,color:B.muted,letterSpacing:"0.08em"}}>{savedBrands.length} Brand{savedBrands.length!==1?"s":""} · {results.brandInfo?.brandName||brandInfo.brandName}</div>
          <button onClick={()=>setBrandForm(EMPTY_BRAND())} style={{background:B.primary,color:"#fff",border:"none",borderRadius:4,padding:"8px 18px",fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer"}}>+ New Brand</button>
        </div>
        {savedBrands.length===0?(
          <div onClick={()=>setBrandForm(EMPTY_BRAND())} style={{border:`1.5px dashed ${B.border}`,borderRadius:8,padding:40,textAlign:"center",cursor:"pointer",transition:"border-color 0.15s"}}
            onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
            onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
            <div style={{fontSize:24,color:B.muted,marginBottom:8}}>+</div>
            <div style={{color:B.muted,fontSize:13}}>Add New Brand</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {savedBrands.map((b:any)=>(
              <div key={b.id} style={{background:B.surface,border:`1.5px solid ${B.border}`,borderRadius:8,padding:20,cursor:"pointer",transition:"border-color 0.15s",position:"relative"}}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}
                onClick={()=>setBrandForm({...b})}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <div style={{width:36,height:36,borderRadius:6,background:b.colors[0]?.hex||B.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13,fontFamily:"'Playfair Display',serif",flexShrink:0}}>
                    {b.logoText||b.brandName?.slice(0,2)||"SL"}
                  </div>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,fontWeight:500,color:B.text}}>{b.brandName}</div>
                    <div style={{fontSize:10,color:B.muted,marginTop:1}}>{b.tagline}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:4,marginBottom:4}}>
                  {b.colors.map((c:any,i:number)=>(
                    <div key={i} style={{width:16,height:16,borderRadius:2,background:c.hex,border:`1px solid ${B.border}`}}/>
                  ))}
                </div>
                <button onClick={e=>{e.stopPropagation();if(confirm("Delete brand?"))saveBrands(savedBrands.filter((x:any)=>x.id!==b.id));}} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:B.muted,cursor:"pointer",fontSize:13,padding:0}}>✕</button>
              </div>
            ))}
            <div onClick={()=>setBrandForm(EMPTY_BRAND())} style={{background:"transparent",border:`1.5px dashed ${B.border}`,borderRadius:8,padding:20,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:120,transition:"border-color 0.15s"}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor=B.primary)}
              onMouseLeave={e=>(e.currentTarget.style.borderColor=B.border)}>
              <div style={{fontSize:20,color:B.muted,marginBottom:6}}>+</div>
              <div style={{color:B.muted,fontSize:11}}>New Brand</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renders={tasks:renderTasks,briefs:renderBriefs,copy:renderCopy,calendar:renderCalendar};
  const colLabel=brandInfo.collectionName?` · ${brandInfo.collectionName} Collection`:"";

  return (
    <><style>{css}</style>
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <div className="topbar-accent"/>
          <div><div className="brand">{brandInfo.brandName}</div><div className="brand-sub">{brandInfo.collectionName||"Product Launch"}</div></div>
        </div>
        <div className="topbar-mid">
          {products.map(p=>p.productName).filter(Boolean).map((n,i)=>(
            <span key={i} className="topbar-tag">{n}</span>
          ))}
        </div>
        <div className="topbar-right"><button className="reset-btn" onClick={reset}>← New Launch</button></div>
      </div>
      <div className="rw">
        <nav className="rsb">
          <div className="rsbl">Output</div>
          <div className="overall-prog">
            <div className="op-label">Progress <span>{prog}%</span></div>
            <div className="op-bar-bg"><div className="op-bar" style={{width:`${prog}%`}}/></div>
          </div>
          {navItems.map(n=>(
            <button key={n.id} className={`rni ${activeResult===n.id?"on":""}`} onClick={()=>setAR(n.id)}>
              <span className="rni-icon" style={{color:activeResult===n.id?"#CB0033":"#7A5540"}}>{n.icon}</span>
              <span className="rni-label">{n.label}</span>
            </button>
          ))}
        </nav>
        <main className="rm">
          <div className="rh">
            <h2 className="rt">
              {activeResult==="tasks"&&<><em>Task</em> Checklists</>}
              {activeResult==="briefs"&&<><em>Department</em> Briefs</>}
              {activeResult==="copy"&&<><em>Platform</em> Copy</>}
              {activeResult==="calendar"&&<><em>Launch</em> Calendar</>}
            </h2>
            <p className="rs">{products.length} Product{products.length>1?"s":""}{colLabel} · {brandInfo.launchDate} · {brandInfo.platforms.join(" · ")}</p>
          </div>
          {renders[activeResult]?.()}
        </main>
      </div>
    </div></>
  );
}
