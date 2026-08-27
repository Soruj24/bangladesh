const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { mongodb_url } = require("./secret");
require("dotenv").config();

const Division = require("./model/Division");
const District = require("./model/District");
const Upazila = require("./model/Upazila");
const Union = require("./model/Union");
const Village = require("./model/Village");
const User = require("./model/userModel");
const Population = require("./model/populationModel");

const seedData = {
  divisions: [
    {
      name: "Dhaka",
      districts: [
        {
          name: "Dhaka",
          upazilas: [
            { name: "Dhanmondi", unions: [{ name: "Dhanmondi Union", villages: [{ name: "Dhanmondi" }, { name: "Shankar" }] }] },
            { name: "Gulshan", unions: [{ name: "Gulshan Union", villages: [{ name: "Gulshan" }, { name: "Banani" }] }] },
            { name: "Mirpur", unions: [{ name: "Mirpur Union", villages: [{ name: "Mirpur" }, { name: "Pallabi" }] }] },
          ],
        },
        {
          name: "Gazipur",
          upazilas: [
            { name: "Gazipur Sadar", unions: [{ name: "Gazipur Union", villages: [{ name: "Gazipur" }, { name: "Konabari" }] }] },
            { name: "Tongi", unions: [{ name: "Tongi Union", villages: [{ name: "Tongi" }, { name: "Station Road" }] }] },
          ],
        },
        {
          name: "Narayanganj",
          upazilas: [
            { name: "Narayanganj Sadar", unions: [{ name: "Narayanganj Union", villages: [{ name: "Narayanganj" }, { name: "Fatulla" }] }] },
            { name: "Sonargaon", unions: [{ name: "Sonargaon Union", villages: [{ name: "Sonargaon" }, { name: "Goalmari" }] }] },
          ],
        },
      ],
    },
    {
      name: "Chattogram",
      districts: [
        {
          name: "Chattogram",
          upazilas: [
            { name: "Chattogram Sadar", unions: [{ name: "Chattogram Union", villages: [{ name: "Agrabad" }, { name: "Nasirabad" }] }] },
            { name: "Hathazari", unions: [{ name: "Hathazari Union", villages: [{ name: "Hathazari" }, { name: "Chikondi" }] }] },
            { name: "Raozan", unions: [{ name: "Raozan Union", villages: [{ name: "Raozan" }, { name: "Khoazadi" }] }] },
          ],
        },
        {
          name: "Cox's Bazar",
          upazilas: [
            { name: "Cox's Bazar Sadar", unions: [{ name: "Cox's Bazar Union", villages: [{ name: "Cox's Bazar" }, { name: "Inani" }] }] },
            { name: "Teknaf", unions: [{ name: "Teknaf Union", villages: [{ name: "Teknaf" }, { name: "Ukhia" }] }] },
          ],
        },
        {
          name: "Comilla",
          upazilas: [
            { name: "Comilla Sadar", unions: [{ name: "Comilla Union", villages: [{ name: "Comilla" }, { name: "Kandirpar" }] }] },
            { name: "Chandina", unions: [{ name: "Chandina Union", villages: [{ name: "Chandina" }, { name: "Adra" }] }] },
          ],
        },
      ],
    },
    {
      name: "Rajshahi",
      districts: [
        {
          name: "Rajshahi",
          upazilas: [
            { name: "Rajshahi Sadar", unions: [{ name: "Rajshahi Union", villages: [{ name: "Rajshahi" }, { name: "Boalia" }] }] },
            { name: "Godagari", unions: [{ name: "Godagari Union", villages: [{ name: "Godagari" }, { name: "Mohanpur" }] }] },
          ],
        },
        {
          name: "Bogura",
          upazilas: [
            { name: "Bogura Sadar", unions: [{ name: "Bogura Union", villages: [{ name: "Bogura" }, { name: "Satmatha" }] }] },
            { name: "Shajahanpur", unions: [{ name: "Shajahanpur Union", villages: [{ name: "Shajahanpur" }, { name: "Khetlal" }] }] },
          ],
        },
      ],
    },
    {
      name: "Khulna",
      districts: [
        {
          name: "Khulna",
          upazilas: [
            { name: "Khulna Sadar", unions: [{ name: "Khulna Union", villages: [{ name: "Khulna" }, { name: "Khalishpur" }] }] },
            { name: "Daulatpur", unions: [{ name: "Daulatpur Union", villages: [{ name: "Daulatpur" }, { name: "Khan Jahan Ali" }] }] },
          ],
        },
        {
          name: "Satkhira",
          upazilas: [
            { name: "Satkhira Sadar", unions: [{ name: "Satkhira Union", villages: [{ name: "Satkhira" }, { name: "Kalaroa" }] }] },
          ],
        },
      ],
    },
    {
      name: "Barisal",
      districts: [
        {
          name: "Barisal",
          upazilas: [
            { name: "Barisal Sadar", unions: [{ name: "Barisal Union", villages: [{ name: "Barisal" }, { name: "Kawnia" }] }] },
            { name: "Babuganj", unions: [{ name: "Babuganj Union", villages: [{ name: "Babuganj" }, { name: "Chandpasha" }] }] },
          ],
        },
        {
          name: "Patuakhali",
          upazilas: [
            { name: "Patuakhali Sadar", unions: [{ name: "Patuakhali Union", villages: [{ name: "Patuakhali" }, { name: "Dashmina" }] }] },
          ],
        },
      ],
    },
    {
      name: "Sylhet",
      districts: [
        {
          name: "Sylhet",
          upazilas: [
            { name: "Sylhet Sadar", unions: [{ name: "Sylhet Union", villages: [{ name: "Sylhet" }, { name: "Mogla" }] }] },
            { name: "Companiganj", unions: [{ name: "Companiganj Union", villages: [{ name: "Companiganj" }, { name: "Isakhil" }] }] },
          ],
        },
        {
          name: "Moulvibazar",
          upazilas: [
            { name: "Moulvibazar Sadar", unions: [{ name: "Moulvibazar Union", villages: [{ name: "Moulvibazar" }, { name: "Kamalganj" }] }] },
          ],
        },
      ],
    },
    {
      name: "Rangpur",
      districts: [
        {
          name: "Rangpur",
          upazilas: [
            { name: "Rangpur Sadar", unions: [{ name: "Rangpur Union", villages: [{ name: "Rangpur" }, { name: "Haragach" }] }] },
            { name: "Gangachara", unions: [{ name: "Gangachara Union", villages: [{ name: "Gangachara" }, { name: "Tajhat" }] }] },
          ],
        },
        {
          name: "Dinajpur",
          upazilas: [
            { name: "Dinajpur Sadar", unions: [{ name: "Dinajpur Union", villages: [{ name: "Dinajpur" }, { name: "Biral" }] }] },
          ],
        },
      ],
    },
    {
      name: "Mymensingh",
      districts: [
        {
          name: "Mymensingh",
          upazilas: [
            { name: "Mymensingh Sadar", unions: [{ name: "Mymensingh Union", villages: [{ name: "Mymensingh" }, { name: "Phulpur" }] }] },
            { name: "Trishal", unions: [{ name: "Trishal Union", villages: [{ name: "Trishal" }, { name: "Dobaura" }] }] },
          ],
        },
        {
          name: "Jamalpur",
          upazilas: [
            { name: "Jamalpur Sadar", unions: [{ name: "Jamalpur Union", villages: [{ name: "Jamalpur" }, { name: "Sarishabari" }] }] },
          ],
        },
      ],
    },
  ],
};

const users = [
  { name: "Super Admin", email: "superadmin@demo.com", password: "Admin@123", isAdmin: true, isSuperAdmin: true },
  { name: "Admin User", email: "admin@demo.com", password: "Admin@123", isAdmin: true, isSuperAdmin: false },
  { name: "Regular User", email: "user@demo.com", password: "User@1234", isAdmin: false, isSuperAdmin: false },
];

const populationRecords = [
  { name: "Kamal Hossain", email: "kamal@demo.com", phone: "+8801712345678", tag: "Engineer", bio: "Civil engineer from Dhaka with 10 years of experience in bridge construction." },
  { name: "Fatima Begum", email: "fatima@demo.com", phone: "+8801812345679", tag: "Doctor", bio: "General physician working at Chattogram Medical College Hospital." },
  { name: "Rahim Uddin", email: "rahim@demo.com", phone: "+8801912345680", tag: "Teacher", bio: "High school mathematics teacher in Rajshahi with a passion for education." },
  { name: "Sabrina Akter", email: "sabrina@demo.com", phone: "+8801612345681", tag: "Business", bio: "Small business owner running a boutique clothing store in Sylhet." },
  { name: "Md. Hasan Ali", email: "hasan@demo.com", phone: "+8801512345682", tag: "Farmer", bio: "Organic rice farmer in Rangpur cultivating 5 acres of land." },
  { name: "Nusrat Jahan", email: "nusrat@demo.com", phone: "+8801312345683", tag: "Nurse", bio: "Registered nurse at Khulna Medical College with 5 years of experience." },
  { name: "Abdul Karim", email: "abdul@demo.com", phone: "+8801412345684", tag: "Lawyer", bio: "Senior advocate practicing at Barisal District Court." },
  { name: "Taslima Begum", email: "taslima@demo.com", phone: "+8801112345685", tag: "Student", bio: "Final year computer science student at Mymensingh University." },
];

async function seed() {
  try {
    await mongoose.connect(mongodb_url);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Division.deleteMany({});
    await District.deleteMany({});
    await Upazila.deleteMany({});
    await Union.deleteMany({});
    await Village.deleteMany({});
    await User.deleteMany({});
    await Population.deleteMany({});
    console.log("Cleared existing data");

    // Track IDs for linking
    const divisionIds = {};

    // Seed divisions and their nested hierarchy
    for (const div of seedData.divisions) {
      const divisionDoc = await Division.create({ name: div.name });
      divisionIds[div.name] = divisionDoc._id;
      console.log(`  Created Division: ${div.name}`);

      for (const dist of div.districts) {
        const districtDoc = await District.create({ name: dist.name, division: divisionDoc._id });
        divisionDoc.districts.push(districtDoc._id);
        await divisionDoc.save();
        console.log(`    Created District: ${dist.name}`);

        for (const upa of dist.upazilas) {
          const upazilaDoc = await Upazila.create({ name: upa.name, district: districtDoc._id });
          districtDoc.upazilas.push(upazilaDoc._id);
          await districtDoc.save();
          console.log(`      Created Upazila: ${upa.name}`);

          for (const uni of upa.unions) {
            const unionDoc = await Union.create({ name: uni.name, upazila: upazilaDoc._id });
            upazilaDoc.unions.push(unionDoc._id);
            await upazilaDoc.save();
            console.log(`        Created Union: ${uni.name}`);

            for (const vil of uni.villages) {
              const villageDoc = await Village.create({ name: vil.name });
              unionDoc.villages.push(villageDoc._id);
              await unionDoc.save();
              console.log(`          Created Village: ${vil.name}`);
            }
          }
        }
      }
    }

    // Seed users
    for (const userData of users) {
      await User.create(userData);
      console.log(`  Created User: ${userData.name} (${userData.email})`);
    }

    // Seed population records
    const allDivisions = await Division.find();
    const allDistricts = await District.find();
    const allUpazilas = await Upazila.find();
    const allUnions = await Union.find();
    const allVillages = await Village.find();

    for (let i = 0; i < populationRecords.length; i++) {
      const rec = populationRecords[i];
      await Population.create({
        ...rec,
        division: allDivisions[i % allDivisions.length]._id,
        district: allDistricts[i % allDistricts.length]._id,
        upazila: allUpazilas[i % allUpazilas.length]._id,
        union: allUnions[i % allUnions.length]._id,
        village: allVillages[i % allVillages.length]._id,
      });
      console.log(`  Created Population: ${rec.name}`);
    }

    // Summary
    const divCount = await Division.countDocuments();
    const distCount = await District.countDocuments();
    const upaCount = await Upazila.countDocuments();
    const uniCount = await Union.countDocuments();
    const vilCount = await Village.countDocuments();
    const userCount = await User.countDocuments();
    const popCount = await Population.countDocuments();

    console.log("\n=== Seed Complete ===");
    console.log(`Divisions:  ${divCount}`);
    console.log(`Districts:  ${distCount}`);
    console.log(`Upazilas:   ${upaCount}`);
    console.log(`Unions:     ${uniCount}`);
    console.log(`Villages:   ${vilCount}`);
    console.log(`Users:      ${userCount}`);
    console.log(`Population: ${popCount}`);

    console.log("\n=== Test Accounts ===");
    console.log("Super Admin: superadmin@demo.com / Admin@123");
    console.log("Admin:       admin@demo.com / Admin@123");
    console.log("User:        user@demo.com / User@1234");

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
