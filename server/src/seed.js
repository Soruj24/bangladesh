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
            { name: "Dhanmondi", unions: [{ name: "Dhanmondi Union", villages: [{ name: "Dhanmondi" }, { name: "Shankar" }, { name: "Jigatola" }, { name: "Shukrabad" }] }, { name: "Lalmatia Union", villages: [{ name: "Lalmatia" }, { name: "Adabar" }, { name: "Azimpur" }] }] },
            { name: "Gulshan", unions: [{ name: "Gulshan Union", villages: [{ name: "Gulshan" }, { name: "Banani" }, { name: "Kemal Ataturk Avenue" }] }, { name: "Niketan Union", villages: [{ name: "Niketan" }, { name: "Nikunja" }] }] },
            { name: "Mirpur", unions: [{ name: "Mirpur Union", villages: [{ name: "Mirpur" }, { name: "Pallabi" }, { name: "Mirpur DOHS" }, { name: "Kochukhet" }] }, { name: "Kathalbagan Union", villages: [{ name: "Kathalbagan" }, { name: "Kazi Nazrul Islam Avenue" }] }] },
            { name: "Motijheel", unions: [{ name: "Motijheel Union", villages: [{ name: "Motijheel" }, { name: "Arambagh" }, { name: "Segunbagicha" }, { name: "Ramna" }] }] },
            { name: "Tejgaon", unions: [{ name: "Tejgaon Union", villages: [{ name: "Tejgaon" }, { name: "Sher-e-Bangla Nagar" }, { name: "Farmgate" }] }] },
            { name: "Mohammadpur", unions: [{ name: "Mohammadpur Union", villages: [{ name: "Mohammadpur" }, { name: "Thanapara" }, { name: "Tajmahal Road" }] }] },
          ],
        },
        {
          name: "Gazipur",
          upazilas: [
            { name: "Gazipur Sadar", unions: [{ name: "Gazipur Union", villages: [{ name: "Gazipur" }, { name: "Konabari" }, { name: "Chandna" }, { name: "Barmi" }] }, { name: "Kashimpur Union", villages: [{ name: "Kashimpur" }, { name: "Kaliakoir" }] }] },
            { name: "Tongi", unions: [{ name: "Tongi Union", villages: [{ name: "Tongi" }, { name: "Station Road" }, { name: "ETC" }, { name: "Pagar" }] }] },
            { name: "Kaliakoir", unions: [{ name: "Kaliakoir Union", villages: [{ name: "Kaliakoir" }, { name: "Harirampur" }, { name: "Satbaria" }] }] },
            { name: "Sreepur", unions: [{ name: "Sreepur Union", villages: [{ name: "Sreepur" }, { name: "Rajendrapur" }, { name: "Boroberun" }] }] },
          ],
        },
        {
          name: "Narayanganj",
          upazilas: [
            { name: "Narayanganj Sadar", unions: [{ name: "Narayanganj Union", villages: [{ name: "Narayanganj" }, { name: "Fatulla" }, { name: "Signboard" }, { name: "Chashara" }] }] },
            { name: "Sonargaon", unions: [{ name: "Sonargaon Union", villages: [{ name: "Sonargaon" }, { name: "Goalmari" }, { name: "Panam Nagar" }, { name: "Hashara" }] }] },
            { name: "Araihazar", unions: [{ name: "Araihazar Union", villages: [{ name: "Araihazar" }, { name: "Binodpur" }, { name: "Mograpara" }] }] },
            { name: "Rupganj", unions: [{ name: "Rupganj Union", villages: [{ name: "Rupganj" }, { name: "Taltechhini" }, { name: "Kanchpur" }] }] },
          ],
        },
        {
          name: "Tangail",
          upazilas: [
            { name: "Tangail Sadar", unions: [{ name: "Tangail Union", villages: [{ name: "Tangail" }, { name: "Surya Nagar" }, { name: "Kamrabad" }, { name: "Lakshmiganj" }] }] },
            { name: "Kalihati", unions: [{ name: "Kalihati Union", villages: [{ name: "Kalihati" }, { name: "Nagbari" }, { name: "Ballabhpur" }] }] },
            { name: "Mirzapur", unions: [{ name: "Mirzapur Union", villages: [{ name: "Mirzapur" }, { name: "Bausha" }, { name: "Deulabari" }] }] },
          ],
        },
        {
          name: "Manikganj",
          upazilas: [
            { name: "Manikganj Sadar", unions: [{ name: "Manikganj Union", villages: [{ name: "Manikganj" }, { name: "Baruhi" }, { name: "Saturia" }] }] },
            { name: "Singair", unions: [{ name: "Singair Union", villages: [{ name: "Singair" }, { name: "Tarabunia" }, { name: "Chengishakhara" }] }] },
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
            { name: "Chattogram Sadar", unions: [{ name: "Chattogram Union", villages: [{ name: "Agrabad" }, { name: "Nasirabad" }, { name: "GEC Circle" }, { name: "Dampara" }] }, { name: "Kotwali Union", villages: [{ name: "Kotwali" }, { name: "Danialabad" }, { name: "Alipur" }] }] },
            { name: "Hathazari", unions: [{ name: "Hathazari Union", villages: [{ name: "Hathazari" }, { name: "Chikondi" }, { name: "Debighata" }, { name: "Mekhal" }] }] },
            { name: "Raozan", unions: [{ name: "Raozan Union", villages: [{ name: "Raozan" }, { name: "Khoazadi" }, { name: "Fatepur" }, { name: "Chattogram Hill" }] }] },
            { name: "Patenga", unions: [{ name: "Patenga Union", villages: [{ name: "Patenga" }, { name: "South Halishahar" }, { name: "Bhatiari" }, { name: "Foy's Lake" }] }] },
            { name: "Mirsharai", unions: [{ name: "Mirsharai Union", villages: [{ name: "Mirsharai" }, { name: "Zorwarghat" }, { name: "Siyyadpur" }] }] },
          ],
        },
        {
          name: "Cox's Bazar",
          upazilas: [
            { name: "Cox's Bazar Sadar", unions: [{ name: "Cox's Bazar Union", villages: [{ name: "Cox's Bazar" }, { name: "Inani" }, { name: "Himchari" }, { name: "Bolnobazar" }] }] },
            { name: "Teknaf", unions: [{ name: "Teknaf Union", villages: [{ name: "Teknaf" }, { name: "Ukhia" }, { name: "Hnila" }, { name: "Whykong" }] }] },
            { name: "Chakaria", unions: [{ name: "Chakaria Union", villages: [{ name: "Chakaria" }, { name: "Pekua" }, { name: "Dulahazra" }] }] },
            { name: "Ukhiya", unions: [{ name: "Ukhiya Union", villages: [{ name: "Ukhiya" }, { name: "Kutupalong" }, { name: "Jaliyapalong" }] }] },
          ],
        },
        {
          name: "Comilla",
          upazilas: [
            { name: "Comilla Sadar", unions: [{ name: "Comilla Union", villages: [{ name: "Comilla" }, { name: "Kandirpar" }, { name: "Halda Road" }, { name: "Laksham Road" }] }] },
            { name: "Chandina", unions: [{ name: "Chandina Union", villages: [{ name: "Chandina" }, { name: "Adra" }, { name: "Adarpur" }, { name: "Daudpur" }] }] },
            { name: "Daudkandi", unions: [{ name: "Daudkandi Union", villages: [{ name: "Daudkandi" }, { name: "Sharifpur" }, { name: "Dhonpur" }] }] },
            { name: "Laksam", unions: [{ name: "Laksam Union", villages: [{ name: "Laksam" }, { name: "Barera" }, { name: "Jhikargacha" }] }] },
          ],
        },
        {
          name: "Feni",
          upazilas: [
            { name: "Feni Sadar", unions: [{ name: "Feni Union", villages: [{ name: "Feni" }, { name: "Kaypara" }, { name: "Munshirhat" }, { name: "Mongalkote" }] }] },
            { name: "Daganbhuiyan", unions: [{ name: "Daganbhuiyan Union", villages: [{ name: "Daganbhuiyan" }, { name: "Haladpur" }, { name: "Tilpur" }] }] },
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
            { name: "Rajshahi Sadar", unions: [{ name: "Rajshahi Union", villages: [{ name: "Rajshahi" }, { name: "Boalia" }, { name: "Motihar" }, { name: "Shahmirpur" }] }, { name: "Tonirghat Union", villages: [{ name: "Tonirghat" }, { name: "Chandrima" }] }] },
            { name: "Godagari", unions: [{ name: "Godagari Union", villages: [{ name: "Godagari" }, { name: "Mohanpur" }, { name: "Charghat" }, { name: "Tebaria" }] }] },
            { name: "Paba", unions: [{ name: "Paba Union", villages: [{ name: "Paba" }, { name: "Horipur" }, { name: "Talaimari" }] }] },
            { name: "Tanore", unions: [{ name: "Tanore Union", villages: [{ name: "Tanore" }, { name: "Ganipur" }, { name: "Alipur" }] }] },
          ],
        },
        {
          name: "Bogura",
          upazilas: [
            { name: "Bogura Sadar", unions: [{ name: "Bogura Union", villages: [{ name: "Bogura" }, { name: "Satmatha" }, { name: "Chelopara" }, { name: "Bandreth" }] }] },
            { name: "Shajahanpur", unions: [{ name: "Shajahanpur Union", villages: [{ name: "Shajahanpur" }, { name: "Khetlal" }, { name: "Khanpur" }] }] },
            { name: "Sherpur", unions: [{ name: "Sherpur Union", villages: [{ name: "Sherpur" }, { name: "Dupchanchia" }, { name: "Adamdighi" }] }] },
            { name: "Nandigram", unions: [{ name: "Nandigram Union", villages: [{ name: "Nandigram" }, { name: "Khoksa" }, { name: "Sibrampur" }] }] },
          ],
        },
        {
          name: "Natore",
          upazilas: [
            { name: "Natore Sadar", unions: [{ name: "Natore Union", villages: [{ name: "Natore" }, { name: "Baraigram" }, { name: "Singra" }, { name: "Lalpur" }] }] },
            { name: "Baraigram", unions: [{ name: "Baraigram Union", villages: [{ name: "Baraigram" }, { name: "Hatgachha" }, { name: "Deshmukh" }] }] },
          ],
        },
        {
          name: "Naogaon",
          upazilas: [
            { name: "Naogaon Sadar", unions: [{ name: "Naogaon Union", villages: [{ name: "Naogaon" }, { name: "Ahsanganj" }, { name: "Manda" }, { name: "Patnitala" }] }] },
            { name: "Raninagar", unions: [{ name: "Raninagar Union", villages: [{ name: "Raninagar" }, { name: "Niamatpur" }, { name: "Atrai" }] }] },
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
            { name: "Khulna Sadar", unions: [{ name: "Khulna Union", villages: [{ name: "Khulna" }, { name: "Khalishpur" }, { name: "Sonadanga" }, { name: "Boyra" }] }] },
            { name: "Daulatpur", unions: [{ name: "Daulatpur Union", villages: [{ name: "Daulatpur" }, { name: "Khan Jahan Ali" }, { name: "Rupsa" }, { name: "Terokhada" }] }] },
            { name: "Batiaghata", unions: [{ name: "Batiaghata Union", villages: [{ name: "Batiaghata" }, { name: "Aulnerkela" }, { name: "Gangarampur" }] }] },
            { name: "Dumuria", unions: [{ name: "Dumuria Union", villages: [{ name: "Dumuria" }, { name: "Rupsa" }, { name: "Shyamnagar" }] }] },
          ],
        },
        {
          name: "Satkhira",
          upazilas: [
            { name: "Satkhira Sadar", unions: [{ name: "Satkhira Union", villages: [{ name: "Satkhira" }, { name: "Kalaroa" }, { name: "Debhata" }, { name: "Assasuni" }] }] },
            { name: "Kolaroa", unions: [{ name: "Kolaroa Union", villages: [{ name: "Kolaroa" }, { name: "Shyamnagar" }, { name: "Kaliganj" }] }] },
            { name: "Shyamnagar", unions: [{ name: "Shyamnagar Union", villages: [{ name: "Shyamnagar" }, { name: "Munsigonj" }, { name: "Gabura" }] }] },
          ],
        },
        {
          name: "Bagerhat",
          upazilas: [
            { name: "Bagerhat Sadar", unions: [{ name: "Bagerhat Union", villages: [{ name: "Bagerhat" }, { name: "Fakirhat" }, { name: "Morala" }, { name: "Sarankhola" }] }] },
            { name: "Mongla", unions: [{ name: "Mongla Union", villages: [{ name: "Mongla" }, { name: "Mujib Nagar" }, { name: "Rayenda" }] }] },
          ],
        },
      ],
    },
    {
      name: "Barishal",
      districts: [
        {
          name: "Barishal",
          upazilas: [
            { name: "Barishal Sadar", unions: [{ name: "Barishal Union", villages: [{ name: "Barishal" }, { name: "Kawnia" }, { name: "Nathpur" }, { name: "Tarki" }] }, { name: "Babuganj Union", villages: [{ name: "Babuganj" }, { name: "Chandpasha" }, { name: "Jagurpur" }] }] },
            { name: "Bakerganj", unions: [{ name: "Bakerganj Union", villages: [{ name: "Bakerganj" }, { name: "Meduari" }, { name: "Khabaspur" }] }] },
            { name: "Banaripara", unions: [{ name: "Banaripara Union", villages: [{ name: "Banaripara" }, { name: "Gournadi" }, { name: "Muladi" }] }] },
          ],
        },
        {
          name: "Patuakhali",
          upazilas: [
            { name: "Patuakhali Sadar", unions: [{ name: "Patuakhali Union", villages: [{ name: "Patuakhali" }, { name: "Dashmina" }, { name: "Kalapara" }, { name: "Rangabali" }] }] },
            { name: "Dumki", unions: [{ name: "Dumki Union", villages: [{ name: "Dumki" }, { name: "Kuakata" }, { name: "Latachapli" }] }] },
            { name: "Kalapara", unions: [{ name: "Kalapara Union", villages: [{ name: "Kalapara" }, { name: "Lalua" }, { name: "Mirzaganj" }] }] },
          ],
        },
        {
          name: "Bhola",
          upazilas: [
            { name: "Bhola Sadar", unions: [{ name: "Bhola Union", villages: [{ name: "Bhola" }, { name: "Borhanuddin" }, { name: "Tazumuddin" }, { name: "Charfession" }] }] },
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
            { name: "Sylhet Sadar", unions: [{ name: "Sylhet Union", villages: [{ name: "Sylhet" }, { name: "Mogla" }, { name: "Mankachar" }, { name: "Kumarikhapan" }] }, { name: "Kanishail Union", villages: [{ name: "Kanishail" }, { name: "Ratnapur" }, { name: "Choukidekhi" }] }] },
            { name: "Companiganj", unions: [{ name: "Companiganj Union", villages: [{ name: "Companiganj" }, { name: "Isakhil" }, { name: "Fatehpur" }, { name: "Laxmipasha" }] }] },
            { name: "Golapganj", unions: [{ name: "Golapganj Union", villages: [{ name: "Golapganj" }, { name: "Badeghata" }, { name: "Dewanbazar" }] }] },
            { name: "Bishwanath", unions: [{ name: "Bishwanath Union", villages: [{ name: "Bishwanath" }, { name: "Dashghar" }, { name: "Barlekha" }] }] },
          ],
        },
        {
          name: "Moulvibazar",
          upazilas: [
            { name: "Moulvibazar Sadar", unions: [{ name: "Moulvibazar Union", villages: [{ name: "Moulvibazar" }, { name: "Kamalganj" }, { name: "Sreemangal" }, { name: "Barlekha" }] }] },
            { name: "Sreemangal", unions: [{ name: "Sreemangal Union", villages: [{ name: "Sreemangal" }, { name: "Rauthgul" }, { name: "Kalabagan" }, { name: "Satgaon" }] }] },
            { name: "Kamalganj", unions: [{ name: "Kamalganj Union", villages: [{ name: "Kamalganj" }, { name: "Adampur" }, { name: "Killa" }] }] },
          ],
        },
        {
          name: "Habiganj",
          upazilas: [
            { name: "Habiganj Sadar", unions: [{ name: "Habiganj Union", villages: [{ name: "Habiganj" }, { name: "Chunarughat" }, { name: "Lakhai" }, { name: "Baniachong" }] }] },
            { name: "Chunarughat", unions: [{ name: "Chunarughat Union", villages: [{ name: "Chunarughat" }, { name: "Nabiganj" }, { name: "Bahubal" }] }] },
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
            { name: "Rangpur Sadar", unions: [{ name: "Rangpur Union", villages: [{ name: "Rangpur" }, { name: "Haragach" }, { name: "Gangachara" }, { name: "Tajhat" }] }, { name: "Mahiganj Union", villages: [{ name: "Mahiganj" }, { name: "Jahajpur" }] }] },
            { name: "Gangachara", unions: [{ name: "Gangachara Union", villages: [{ name: "Gangachara" }, { name: "Tajhat" }, { name: "Mominpur" }, { name: "Putimari" }] }] },
            { name: "Kaugachhi", unions: [{ name: "Kaugachhi Union", villages: [{ name: "Kaugachhi" }, { name: "Kshipara" }, { name: "Nawdanga" }] }] },
          ],
        },
        {
          name: "Dinajpur",
          upazilas: [
            { name: "Dinajpur Sadar", unions: [{ name: "Dinajpur Union", villages: [{ name: "Dinajpur" }, { name: "Biral" }, { name: "Khansama" }, { name: "Birampur" }] }] },
            { name: "Birganj", unions: [{ name: "Birganj Union", villages: [{ name: "Birganj" }, { name: "Ghoraghat" }, { name: "Parbatipur" }] }] },
            { name: "Bochaganj", unions: [{ name: "Bochaganj Union", villages: [{ name: "Bochaganj" }, { name: "Nawabganj" }, { name: "Chirirbandar" }] }] },
          ],
        },
        {
          name: "Thakurgaon",
          upazilas: [
            { name: "Thakurgaon Sadar", unions: [{ name: "Thakurgaon Union", villages: [{ name: "Thakurgaon" }, { name: "Baliadangi" }, { name: "Haripur" }, { name: "Pirganj" }] }] },
            { name: "Pirganj", unions: [{ name: "Pirganj Union", villages: [{ name: "Pirganj" }, { name: "Ranisankail" }, { name: "Boda" }] }] },
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
            { name: "Mymensingh Sadar", unions: [{ name: "Mymensingh Union", villages: [{ name: "Mymensingh" }, { name: "Phulpur" }, { name: "Haluaghat" }, { name: "Tara Khanda" }] }, { name: "Dobrashahar Union", villages: [{ name: "Dobrashahar" }, { name: "Char Islands" }] }] },
            { name: "Trishal", unions: [{ name: "Trishal Union", villages: [{ name: "Trishal" }, { name: "Dobaura" }, { name: "Gafargaon" }, { name: "Ishwarganj" }] }] },
            { name: "Phulpur", unions: [{ name: "Phulpur Union", villages: [{ name: "Phulpur" }, { name: "Tangail" }, { name: "Nandail" }, { name: "Gauripur" }] }] },
          ],
        },
        {
          name: "Jamalpur",
          upazilas: [
            { name: "Jamalpur Sadar", unions: [{ name: "Jamalpur Union", villages: [{ name: "Jamalpur" }, { name: "Sarishabari" }, { name: "Melandaha" }, { name: "Dewanganj" }] }] },
            { name: "Sarishabari", unions: [{ name: "Sarishabari Union", villages: [{ name: "Sarishabari" }, { name: "T Islampur" }, { name: "Madarganj" }] }] },
            { name: "Dewanganj", unions: [{ name: "Dewanganj Union", villages: [{ name: "Dewanganj" }, { name: "Baksiganj" }, { name: "Mahendrganj" }] }] },
          ],
        },
        {
          name: "Netrokona",
          upazilas: [
            { name: "Netrokona Sadar", unions: [{ name: "Netrokona Union", villages: [{ name: "Netrokona" }, { name: "Atpara" }, { name: "Barhatta" }, { name: "Durgapur" }] }] },
            { name: "Durgapur", unions: [{ name: "Durgapur Union", villages: [{ name: "Durgapur" }, { name: "Hatiya" }, { name: "Purbadhala" }] }] },
          ],
        },
        {
          name: "Sherpur",
          upazilas: [
            { name: "Sherpur Sadar", unions: [{ name: "Sherpur Union", villages: [{ name: "Sherpur" }, { name: "Nakla" }, { name: "Lalmonirhat" }, { name: "Sreekhola" }] }] },
            { name: "Nakla", unions: [{ name: "Nakla Union", villages: [{ name: "Nakla" }, { name: "Jhenaigati" }, { name: "Tanjore" }] }] },
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
  { name: "Rahim Uddin", email: "rahim@demo.com", password: "Rahim@123", isAdmin: true, isSuperAdmin: false },
  { name: "Fatima Khan", email: "fatima@demo.com", password: "Fatima@123", isAdmin: false, isSuperAdmin: false },
  { name: "Kamal Hossain", email: "kamal@demo.com", password: "Kamal@123", isAdmin: true, isSuperAdmin: false },
  { name: "Nusrat Jahan", email: "nusrat@demo.com", password: "Nusrat@123", isAdmin: false, isSuperAdmin: false },
  { name: "Abdul Karim", email: "abdul@demo.com", password: "Abdul@123", isAdmin: true, isSuperAdmin: false },
  { name: "Taslima Begum", email: "taslima@demo.com", password: "Taslima@123", isAdmin: false, isSuperAdmin: false },
  { name: "Mizanur Rahman", email: "mizan@demo.com", password: "Mizan@123", isAdmin: false, isSuperAdmin: false },
  { name: "Sabrina Akter", email: "sabrina@demo.com", password: "Sabrina@123", isAdmin: false, isSuperAdmin: false },
  { name: "Md. Hasan Ali", email: "hasan@demo.com", password: "Hasan@123", isAdmin: true, isSuperAdmin: false },
  { name: "Shirin Akhter", email: "shirin@demo.com", password: "Shirin@123", isAdmin: false, isSuperAdmin: false },
  { name: "Anisur Islam", email: "anisur@demo.com", password: "Anisur@123", isAdmin: false, isSuperAdmin: false },
  { name: "Ruma Akter", email: "ruma@demo.com", password: "Ruma@123", isAdmin: true, isSuperAdmin: false },
  { name: "Zahid Hasan", email: "zahid@demo.com", password: "Zahid@123", isAdmin: false, isSuperAdmin: false },
  { name: "Ayesha Siddiqua", email: "ayesha@demo.com", password: "Ayesha@123", isAdmin: false, isSuperAdmin: false },
  { name: "Faruk Ahmed", email: "faruk@demo.com", password: "Faruk@123", isAdmin: true, isSuperAdmin: false },
  { name: "Roksana Khatun", email: "roksana@demo.com", password: "Roksana@123", isAdmin: false, isSuperAdmin: false },
  { name: "Imran Hossain", email: "imran@demo.com", password: "Imran@123", isAdmin: false, isSuperAdmin: false },
  { name: "Sumaiya Rahman", email: "sumaiya@demo.com", password: "Sumaiya@123", isAdmin: false, isSuperAdmin: false },
  { name: "Habibur Rahman", email: "habibur@demo.com", password: "Habibur@123", isAdmin: true, isSuperAdmin: false },
  { name: "Monira Begum", email: "monira@demo.com", password: "Monira@123", isAdmin: false, isSuperAdmin: false },
  { name: "Ariful Islam", email: "arif@demo.com", password: "Arif@123", isAdmin: false, isSuperAdmin: false },
  { name: "Jamal Uddin", email: "jamal@demo.com", password: "Jamal@123", isAdmin: false, isSuperAdmin: false },
];

const populationRecords = [
  { name: "Kamal Hossain", email: "pkamal@demo.com", phone: "+8801712345678", tag: "Engineer", bio: "Civil engineer from Dhaka with 10 years of experience in bridge construction." },
  { name: "Fatima Begum", email: "pfatima@demo.com", phone: "+8801812345679", tag: "Doctor", bio: "General physician working at Chattogram Medical College Hospital." },
  { name: "Rahim Uddin", email: "prahim@demo.com", phone: "+8801912345680", tag: "Teacher", bio: "High school mathematics teacher in Rajshahi with a passion for education." },
  { name: "Sabrina Akter", email: "psabrina@demo.com", phone: "+8801612345681", tag: "Business", bio: "Small business owner running a boutique clothing store in Sylhet." },
  { name: "Md. Hasan Ali", email: "phasan@demo.com", phone: "+8801512345682", tag: "Farmer", bio: "Organic rice farmer in Rangpur cultivating 5 acres of land." },
  { name: "Nusrat Jahan", email: "pnusrat@demo.com", phone: "+8801312345683", tag: "Nurse", bio: "Registered nurse at Khulna Medical College with 5 years of experience." },
  { name: "Abdul Karim", email: "pabdul@demo.com", phone: "+8801412345684", tag: "Lawyer", bio: "Senior advocate practicing at Barisal District Court." },
  { name: "Taslima Begum", email: "ptaslima@demo.com", phone: "+8801112345685", tag: "Student", bio: "Final year computer science student at Mymensingh University." },
  { name: "Mizanur Rahman", email: "pmizan@demo.com", phone: "+8801712345686", tag: "Government Officer", bio: "Assistant Commissioner in Dhaka Division administration." },
  { name: "Shirin Akhter", email: "pshirin@demo.com", phone: "+8801812345687", tag: "Journalist", bio: "Investigative journalist covering political affairs for The Daily Star." },
  { name: "Anisur Islam", email: "panisur@demo.com", phone: "+8801912345688", tag: "Businessman", bio: "Managing director of a textile exporting company in Gazipur." },
  { name: "Ruma Akter", email: "pruma@demo.com", phone: "+8801612345689", tag: "Professor", bio: "Professor of Economics at Dhaka University specializing in microeconomics." },
  { name: "Zahid Hasan", email: "pzahid@demo.com", phone: "+8801512345690", tag: "Pharmacist", bio: "Pharmacist running a chain of medical stores in Narayanganj." },
  { name: "Ayesha Siddiqua", email: "payesha@demo.com", phone: "+8801312345691", tag: "Social Worker", bio: "NGO worker focusing on women's empowerment in rural Rajshahi." },
  { name: "Faruk Ahmed", email: "pfaruk@demo.com", phone: "+8801412345692", tag: "Architect", bio: "Sustainable architecture designer based in Sylhet city." },
  { name: "Roksana Khatun", email: "proksana@demo.com", phone: "+8801112345693", tag: "Tailor", bio: "Expert tailor specializing in traditional Bangladeshi embroidery." },
  { name: "Imran Hossain", email: "pimran@demo.com", phone: "+8801712345694", tag: "Driver", bio: "Professional bus driver for BRTC with 15 years of safe driving record." },
  { name: "Sumaiya Rahman", email: "psumaiya@demo.com", phone: "+8801812345695", tag: "Homemaker", bio: "Dedicated homemaker and part-time online seller of homemade pickles." },
  { name: "Habibur Rahman", email: "phabibur@demo.com", phone: "+8801912345696", tag: "Accountant", bio: "Chartered accountant working at a leading audit firm in Khulna." },
  { name: "Monira Begum", email: "pmonira@demo.com", phone: "+8801612345697", tag: "Agriculture", bio: "Progressive farmer in Dinajpur growing vegetables using drip irrigation." },
  { name: "Ariful Islam", email: "parif@demo.com", phone: "+8801512345698", tag: "Mechanic", bio: "Skilled motorcycle mechanic in Cox's Bazar tourist area." },
  { name: "Jamal Uddin", email: "pjamal@demo.com", phone: "+8801312345699", tag: "Fisherman", bio: "Commercial fisherman in Teknaf with his own trawler." },
  { name: "Sabina Yeasmin", email: "psabina@demo.com", phone: "+8801412345700", tag: "Teacher", bio: "Primary school teacher in a rural school in Bogura." },
  { name: "Rafiqul Islam", email: "prafiq@demo.com", phone: "+8801112345701", tag: "Construction Worker", bio: "Experienced construction worker involved in building high-rises in Dhaka." },
  { name: "Aminul Haque", email: "paminul@demo.com", phone: "+8801712345702", tag: "Electrician", bio: "Licensed electrician serving both residential and commercial clients." },
  { name: "Reshma Begum", email: "preshma@demo.com", phone: "+8801812345703", tag: "Garment Worker", bio: "Senior operator in a garment factory in Gazipur with 8 years experience." },
  { name: "Hafizur Rahman", email: "phafiz@demo.com", phone: "+8801912345704", tag: "Rickshaw Puller", bio: "Rickshaw puller in Old Dhaka supporting a family of five." },
  { name: "Latifa Khatun", email: "platifa@demo.com", phone: "+8801612345705", tag: "Street Vendor", bio: "Street food vendor selling famous Jhal Muri near Shahbagh intersection." },
  { name: "Shafiqul Alam", email: "pshafiq@demo.com", phone: "+8801512345706", tag: "Software Developer", bio: "Full-stack developer working remotely for a US-based tech startup." },
  { name: "Nazma Akter", email: "pnazma@demo.com", phone: "+8801312345707", tag: "Nail Artist", bio: "Professional nail artist with a growing Instagram following." },
  { name: "Jahangir Alam", email: "pjahangir@demo.com", phone: "+8801412345708", tag: "Bus Conductor", bio: "Conductor on the Dhaka-Chattogram route for 10 years." },
  { name: "Salma Khatun", email: "psalma@demo.com", phone: "+8801112345709", tag: "Midwife", bio: "Trained community midwife serving villages in Tangail district." },
  { name: "Mahbubul Haq", email: "pmahbub@demo.com", phone: "+8801712345710", tag: "Tea Stall Owner", bio: "Running a popular tea stall near New Market since 1995." },
  { name: "Bilkis Begum", email: "pbilkis@demo.com", phone: "+8801812345711", tag: "Rice Trader", bio: "Wholesale rice trader in Bogura central market." },
  { name: "Shariful Islam", email: "psharif@demo.com", phone: "+8801912345712", tag: "Security Guard", bio: "Night shift security guard at a multinational company in Uttara." },
  { name: "Halima Khatun", email: "phalima@demo.com", phone: "+8801612345713", tag: "Dressmaker", bio: "Expert dressmaker making custom wedding outfits in Mirpur." },
  { name: "Abul Kashem", email: "pabulk@demo.com", phone: "+8801512345714", tag: "Woodworker", bio: "Traditional furniture maker in Rajshahi known for ornate designs." },
  { name: "Fatemah Rahman", email: "pfatemah@demo.com", phone: "+8801312345715", tag: "Bank Officer", bio: "Senior officer at Janata Bank's Barishal branch." },
  { name: "Bashir Uddin", email: "pbashir@demo.com", phone: "+8801412345716", tag: "Auto Rickshaw Driver", bio: "CNG auto-rickshaw driver in Sylhet city." },
  { name: "Monoara Begum", email: "pmonoara@demo.com", phone: "+8801112345717", tag: "Housekeeper", bio: "Experienced housekeeper working at a luxury hotel in Cox's Bazar." },
  { name: "Delwar Hossain", email: "pdelwar@demo.com", phone: "+8801712345718", tag: "Street Performer", bio: "Street musician playing dotara in Ramna Park area." },
  { name: "Ruksana Begum", email: "pruksana@demo.com", phone: "+8801812345719", tag: "Food Processor", bio: "Home-based food processor making chips and snacks for local shops." },
  { name: "Sohel Rana", email: "psohel@demo.com", phone: "+8801912345720", tag: "Photographer", bio: "Wedding and event photographer based in Khulna." },
  { name: "Jesmin Ara", email: "pjesmin@demo.com", phone: "+8801612345721", tag: "Tutor", bio: "Private tutor teaching English and Bangla to O-level students." },
  { name: "Kamrul Hasan", email: "pkamrul@demo.com", phone: "+8801512345722", tag: "Fish Trader", bio: "Wholesale fish trader supplying to restaurants in Dhaka." },
  { name: "Shahanara Begum", email: "pshahanara@demo.com", phone: "+8801312345723", tag: "Poultry Farmer", bio: "Poultry farm owner with 2000 chickens in Savar." },
  { name: "Moniruzzaman", email: "pmonir@demo.com", phone: "+8801412345724", tag: "Bus Driver", bio: "Long-haul bus driver on the Dhaka-Sylhet route." },
  { name: "Nasima Akhter", email: "pnasima@demo.com", phone: "+8801112345725", tag: "Ayurvedic Healer", bio: "Practicing traditional ayurvedic healing in Comilla." },
  { name: "Rubel Hossain", email: "prubel@demo.com", phone: "+8801712345726", tag: "Cricket Coach", bio: "Local cricket coach training young talents in Bogura." },
  { name: "Hasina Begum", email: "phasina@demo.com", phone: "+8801812345727", tag: "Potter", bio: "Skilled potter creating traditional clay pottery in Rangpur." },
  { name: "Mosharraf Hossain", email: "pmosharraf@demo.com", phone: "+8801912345728", tag: "Pharmacy Owner", bio: "Owner of a well-known pharmacy chain in Chattogram." },
  { name: "Shamsun Nahar", email: "pshamsun@demo.com", phone: "+8801612345729", tag: "Librarian", bio: "Head librarian at the national public library in Dhaka." },
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
