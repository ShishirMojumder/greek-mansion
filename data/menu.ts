export type MenuItem = { name:string; description:string; price:string; featured?:boolean };
export type MenuCategory = { name:string; note?:string; items:MenuItem[] };

export const menu: MenuCategory[] = [
 {name:"Appetizers",items:[
  {name:"Greek Fries or Onion Rings",description:"",price:"Small $8.95 · Large $11.95"},
  {name:"Gyro Poutine (Fries or Onion Rings)",description:"",price:"Small $10.95 · Large $14.95"},
  {name:"Crab Cakes (2 pcs)",description:"",price:"$9.00"},
  {name:"Garlic Bread",description:"",price:"$4.95"},
  {name:"1 Stick Chicken Souvlaki",description:"",price:"$3.95"},
  {name:"1 Stick Pork Souvlaki",description:"",price:"$3.95"},
  {name:"Pita",description:"",price:"$1.50"},
  {name:"Grilled Calamari",description:"",price:"$13.95"},
  {name:"Fried Calamari",description:"",price:"$13.95"},
  {name:"Falafel (5 pcs)",description:"",price:"$4.00"},
  {name:"Tzatziki & Pita",description:"",price:"$6.95"},
  {name:"Chicken Wings (1 lb)",description:"",price:"$11.95"},
  {name:"Saganaki",description:"",price:"$11.95"},
  {name:"Spanakopita",description:"",price:"$7.50"}]},

 {name:"Sandwiches on a Bun",note:"Choice of one side for combos: rice, potatoes, fries, onion rings (Greek salad $1.50 or veggies $2.00). Combos come with a regular can of pop. All sandwiches served with lettuce, onions, tomatoes and tzatziki. Sub spicy tzatziki $1.00.",items:[
  {name:"Chicken Souvlaki Sandwich",description:"Chicken souvlaki on a bun with lettuce, onion, tomatoes and tzatziki",price:"Sandwich Only $10.95 · Combo $15.95"},
  {name:"Pork Souvlaki Sandwich",description:"Pork souvlaki on a bun with lettuce, onion, tomatoes and tzatziki",price:"Sandwich Only $10.95 · Combo $15.95"},
  {name:"Gyro Sandwich",description:"Gyro on a bun with lettuce, onion, tomatoes and tzatziki",price:"Sandwich Only $10.95 · Combo $15.95"},
  {name:"Philly Chicken",description:"Green peppers, onions, mushrooms, cheese and tzatziki",price:"Sandwich Only $11.95 · Combo $16.95"},
  {name:"Philly Veggie",description:"Broccoli, cauliflower, green peppers, onions, mushrooms, cheese and tzatziki",price:"Sandwich Only $11.95 · Combo $16.95"},
  {name:"Philly Steak",description:"Green peppers, onions, mushrooms, cheese and tzatziki",price:"Sandwich Only $11.95 · Combo $16.95",featured:true},
  {name:"Fish Sandwich",description:"Haddock on a bun with lettuce, onion, tomatoes and tartar sauce",price:"Sandwich Only $12.95 · Combo $16.95"},
  {name:"Steak Sandwich",description:"6oz steak on a bun with lettuce, onion, tomatoes and tzatziki",price:"Sandwich Only $14.50 · Combo $19.50"},
  {name:"Loukaniko Greek Sausage Sandwich",description:"Pork sausage grilled with lettuce, onion, tomato and tzatziki",price:"Sandwich Only $11.95 · Combo —"},
  {name:"Fish Burger",description:"Wild caught grilled Alaskan pollock topped to your liking",price:"Sandwich Only $12.95 · Combo $16.95"},
  {name:"Chicken Burger",description:"Grilled chicken breast topped to your liking",price:"Sandwich Only $9.95 · Combo $14.95"},
  {name:"Beef Burger",description:"6oz beef burger topped to your liking",price:"Sandwich Only $8.95 · Combo $13.95"}]},

 {name:"Mansion Pita Wraps",note:"Choice of one side for combos: rice, potatoes, fries, onion rings (Greek salad $1.50 or veggies $2.00). Combos come with a regular can of pop. All wraps served with lettuce, onions, tomatoes and tzatziki. Sub spicy tzatziki $1.00.",items:[
  {name:"Chicken Souvlaki (1 Stick)",description:"",price:"Pita Only $7.50 · Combo $13.95"},
  {name:"Chicken Souvlaki (2 Sticks)",description:"",price:"Pita Only $10.50 · Combo $15.95",featured:true},
  {name:"Pork Souvlaki (1 Stick)",description:"",price:"Pita Only $7.50 · Combo $13.95"},
  {name:"Pork Souvlaki (2 Sticks)",description:"",price:"Pita Only $10.50 · Combo $15.95"},
  {name:"Chicken Fillet",description:"",price:"Pita Only $8.95 · Combo $13.95"},
  {name:"Gyro (Lamb & Beef Mixed Meat)",description:"",price:"Pita Only $8.95 · Combo $15.95"},
  {name:"Falafel (Chickpeas)",description:"",price:"Pita Only $7.95 · Combo $14.95"},
  {name:"Veggie",description:"",price:"Pita Only $6.95 · Combo $12.95"}]},

 {name:"Dinner Plates",note:"Choice of two sides: rice, potatoes, fries, onion rings, veggies ($2.00). All plates come with Greek salad.",items:[
  {name:"Chicken Plate",description:"Chicken, skewered and seasoned with Greek spices, cooked over an open flame, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $14.95 · Large $19.95",featured:true},
  {name:"Pork Plate",description:"Pork, skewered and seasoned with Greek spices, cooked over an open flame, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $14.95 · Large $19.95"},
  {name:"Gyro Plate",description:"Seasoned beef and lamb mix, cooked on a vertical rotisserie, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $14.95 · Large $19.95",featured:true},
  {name:"Steak Plate",description:"Steak seasoned with our special seasoning, cooked over an open flame, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $19.95 · Large $26.45"},
  {name:"Lamb Plate",description:"Lamb, skewered and seasoned with Greek spices, cooked over an open flame, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $22.45 · Large $27.45",featured:true},
  {name:"Chicken Fillet Plate",description:"Chicken fillet breast seasoned with Greek spices, cooked over an open flame. Comes with two sides and Greek salad",price:"Regular (1 pc) $19.95 · Large (2 pcs) $24.95"},
  {name:"Veggie Plate",description:"Steamed veggies with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $14.95 · Large $19.95"},
  {name:"Plain Plate",description:"Your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $11.95 · Large $15.95"},
  {name:"Falafel Plate",description:"Falafels, served with your choice of two sides, Greek salad, tzatziki sauce and pita bread",price:"Regular $12.95 · Large $17.95"}]},

 {name:"Mansion Favourites",note:"Choice of sides: rice, potatoes, fries, onion rings, veggies ($2.00).",items:[
  {name:"Fried Calamari Plate",description:"Lightly breaded fresh calamari fried to perfection. Comes with two sides and a Greek salad",price:"$24.95"},
  {name:"Grilled Calamari Plate",description:"Freshly marinated calamari grilled with green peppers and onions. Comes with two sides and a Greek salad",price:"$24.95",featured:true},
  {name:"Spanakopita Plate",description:"Spinach and cheese pastry baked and toasted. Served with two sides and Greek salad",price:"$16.95"},
  {name:"Loukaniko Sausage Plate",description:"Grilled pork Greek sausage over an open flame and charred. Comes with two sides and a Greek salad",price:"$16.95"},
  {name:"Fish and Chips",description:"Two breaded haddock deep fried to a golden crisp and fries, or choose two sides only (salad counts as two)",price:"$16.95",featured:true},
  {name:"Crab Cakes Plate",description:"Breaded crab cake deep fried to a golden crisp. Comes with two sides and a Greek salad",price:"Regular (2 pcs) $20.95 · Large (3 pcs) $25.95"},
  {name:"Mansion BBQ Ribs",description:"Marinated for 24 hours in our housemade BBQ sauce, then grilled over an open flame and smothered in BBQ sauce. Comes with two sides only (salad counts as two)",price:"Half Rack $27.95 · Full Rack $35.95",featured:true},
  {name:"Fish Plate (Large Only)",description:"2 pcs of breaded haddock deep fried or grilled pollock. Comes with two sides and a Greek salad",price:"$25.95"},
  {name:"Grilled Shrimp Plate",description:"Shrimp skewered and cooked over an open flame with our homemade garlic butter on top. Comes with two sides and a Greek salad",price:"Regular $18.95 · Large $24.95"}]},

 {name:"Salads",note:"Add your protein/meat to your salad: Chicken Souvlaki $3.95, Pork Souvlaki $3.95, Chicken Fillet $5.50, Gyro (Lamb and Beef Mixed) $5.75, Falafel (5 pcs) $4.00.",items:[
  {name:"Greek Salad",description:"",price:"Small $7.95 · Medium $9.95 · Large $13.95"},
  {name:"Caesar Salad",description:"",price:"Small $8.95 · Medium $10.95 · Large $13.95"},
  {name:"Country Salad",description:"",price:"Small $9.95 · Medium $11.95 · Large $14.95"}]},

 {name:"Mansion Extras",items:[
  {name:"Tzatziki",description:"Side $1.00",price:"Small $3.75 · Medium $7.50 · Large $12.50"},
  {name:"Spicy Tzatziki",description:"Side $2.00",price:"Small $4.50 · Medium $9.00 · Large $14.00"},
  {name:"French Fries",description:"",price:"Small $5.95 · Medium $7.95 · Large $9.95"},
  {name:"Onion Rings",description:"",price:"Small $6.95 · Medium $8.95 · Large $11.95"},
  {name:"Rice",description:"",price:"Small $5.00 · Medium $9.00 · Large $12.00"},
  {name:"Potatoes",description:"",price:"Small $6.00 · Medium $11.00 · Large $14.00"},
  {name:"Veggies",description:"",price:"Small $8.95 · Medium $12.95 · Large $16.95"},
  {name:"Beef Gravy",description:"",price:"Small $2.95 · Medium $5.95 · Large $7.95"},
  {name:"Gyro (Lamb and Beef Mixed) (Meat Only)",description:"",price:"Small $11.50 · Medium $21.50 · Large $31.50"}]},

 {name:"Kids Menu",note:"Comes with a can of pop.",items:[
  {name:"Burger & Fries",description:"",price:"$11.95"},
  {name:"Pork Stick and Fries",description:"",price:"$9.95"},
  {name:"Chicken Stick and Fries",description:"",price:"$9.95"},
  {name:"Chicken Fingers and Fries",description:"",price:"$9.95"}]},

 {name:"Specials",note:"Lunch boxes available 11 AM – 3 PM.",items:[
  {name:"Rice Lunch Box",description:"Lunch box (11 AM – 3 PM). Choice of chicken, pork or gyro on a bed of rice with a quarter pita, tzatziki, small bag of chips and a can of pop",price:"$11.00"},
  {name:"Fries Lunch Box",description:"Lunch box (11 AM – 3 PM). Choice of chicken, pork or gyro on a bed of fries with a quarter pita, tzatziki, small bag of chips and a can of pop",price:"$11.00"},
  {name:"Mansion Special",description:"Everyday lunch special. Greek salad, rice, potato, quarter pita, and your choice of chicken, pork, or gyro (no substitutions)",price:"$11.00"},
  {name:"Family Special (6 People)",description:"Served with rice, potatoes, Greek salad, 3 pitas, and your choice of 12 souvlaki (chicken or pork) or a large gyro",price:"$71.95"},
  {name:"Family Special (4 People)",description:"Served with rice, potatoes, Greek salad, 2 pitas, and your choice of 8 souvlaki (chicken or pork) or a medium gyro",price:"$49.95"}]},

 {name:"Desserts",items:[
  {name:"Baklava",description:"",price:"$7.95"},
  {name:"Bougatsa Phyllo (Custard Pie)",description:"",price:"$7.95"},
  {name:"Double Fudge Brownie",description:"",price:"$3.50"},
  {name:"Double Fudge Walnut Brownie",description:"",price:"$3.50"},
  {name:"Apple Turnover Pie",description:"",price:"$1.95"},
  {name:"No Sugar Added Vanilla Ice Cream Cup",description:"",price:"$2.50"}]},

 {name:"Catering",note:"All catering cash or debit only. Surcharges may apply otherwise. All orders come with 2 souvlaki/skewers (chicken, pork, gyro, or shrimp), rice, potatoes, Greek salad, tzatziki and pita bread per person. Substitutions available for an additional charge.",items:[
  {name:"10 People Combo",description:"",price:"$135.00"},
  {name:"15 People Combo",description:"",price:"$202.50"},
  {name:"20 People Combo",description:"",price:"$270.00"},
  {name:"25 People Combo",description:"",price:"$337.50"}]}
];
