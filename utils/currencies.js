const currencyData = [
  {
    Region: 'Afghanistan',
    Currency: 'Afghanis',
    Symbol: '؋',
  },
  {
    Region: 'Albania',
    Currency: 'Leke',
    Symbol: 'Lek',
  },
  {
    Region: 'Algeria',
    Currency: 'Dinars',
    Symbol: 'د.ج',
  },
  {
    Region: 'Andorra',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Angola',
    Currency: 'Kwanza',
    Symbol: 'Kz',
  },
  {
    Region: 'Argentina',
    Currency: 'Pesos',
    Symbol: '$',
  },
  {
    Region: 'Armenia',
    Currency: 'Dram',
    Symbol: '֏',
  },
  {
    Region: 'Australia',
    Currency: 'Dollars',
    Symbol: 'A$',
  },
  {
    Region: 'Austria',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Azerbaijan',
    Currency: 'Manats',
    Symbol: '₼',
  },
  {
    Region: 'Bahamas',
    Currency: 'Dollars',
    Symbol: 'B$',
  },
  {
    Region: 'Bahrain',
    Currency: 'Dinars',
    Symbol: '.د.ب',
  },
  {
    Region: 'Bangladesh',
    Currency: 'Taka',
    Symbol: '৳',
  },
  {
    Region: 'Barbados',
    Currency: 'Dollars',
    Symbol: 'Bds$',
  },
  {
    Region: 'Belarus',
    Currency: 'Rubles',
    Symbol: 'Br',
  },
  {
    Region: 'Belgium',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Belize',
    Currency: 'Dollars',
    Symbol: 'BZ$',
  },
  {
    Region: 'Benin',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Bhutan',
    Currency: 'Ngultrum',
    Symbol: 'Nu.',
  },
  {
    Region: 'Bolivia',
    Currency: 'Bolivianos',
    Symbol: 'Bs.',
  },
  {
    Region: 'Bosnia and Herzegovina',
    Currency: 'Marka',
    Symbol: 'KM',
  },
  {
    Region: 'Botswana',
    Currency: 'Pula',
    Symbol: 'P',
  },
  {
    Region: 'Brazil',
    Currency: 'Reais',
    Symbol: 'R$',
  },
  {
    Region: 'Brunei',
    Currency: 'Dollars',
    Symbol: 'B$',
  },
  {
    Region: 'Bulgaria',
    Currency: 'Leva',
    Symbol: 'лв',
  },
  {
    Region: 'Burkina Faso',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Burundi',
    Currency: 'Francs',
    Symbol: 'FBu',
  },
  {
    Region: 'Cambodia',
    Currency: 'Riels',
    Symbol: '៛',
  },
  {
    Region: 'Cameroon',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Canada',
    Currency: 'Dollars',
    Symbol: 'CA$',
  },
  {
    Region: 'Cape Verde',
    Currency: 'Escudos',
    Symbol: 'Esc',
  },
  {
    Region: 'Central African Republic',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Chad',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Chile',
    Currency: 'Pesos',
    Symbol: '$',
  },
  {
    Region: 'China',
    Currency: 'Yuan',
    Symbol: '¥',
  },
  {
    Region: 'Colombia',
    Currency: 'Pesos',
    Symbol: '$',
  },
  {
    Region: 'Comoros',
    Currency: 'Francs',
    Symbol: 'CF',
  },
  {
    Region: 'Congo',
    Currency: 'Francs',
    Symbol: 'FC',
  },
  {
    Region: 'Costa Rica',
    Currency: 'Colones',
    Symbol: '₡',
  },
  {
    Region: 'Croatia',
    Currency: 'Kuna',
    Symbol: 'kn',
  },
  {
    Region: 'Cuba',
    Currency: 'Pesos',
    Symbol: '₱',
  },
  {
    Region: 'Cyprus',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Czech Republic',
    Currency: 'Koruny',
    Symbol: 'Kč',
  },
  {
    Region: 'Denmark',
    Currency: 'Krone',
    Symbol: 'kr',
  },
  {
    Region: 'Djibouti',
    Currency: 'Francs',
    Symbol: 'Fdj',
  },
  {
    Region: 'Dominican Republic',
    Currency: 'Pesos',
    Symbol: 'RD$',
  },
  {
    Region: 'East Timor',
    Currency: 'Dollars',
    Symbol: '$',
  },
  {
    Region: 'Ecuador',
    Currency: 'Dollars',
    Symbol: '$',
  },
  {
    Region: 'Egypt',
    Currency: 'Pounds',
    Symbol: '£',
  },
  {
    Region: 'El Salvador',
    Currency: 'Colones',
    Symbol: '₡',
  },
  {
    Region: 'Equatorial Guinea',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Eritrea',
    Currency: 'Nakfa',
    Symbol: 'Nfk',
  },
  {
    Region: 'Estonia',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Eswatini',
    Currency: 'Emalangeni',
    Symbol: 'L',
  },
  {
    Region: 'Ethiopia',
    Currency: 'Birr',
    Symbol: 'Br',
  },
  {
    Region: 'Fiji',
    Currency: 'Dollars',
    Symbol: 'FJ$',
  },
  {
    Region: 'Finland',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'France',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Gabon',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Gambia',
    Currency: 'Dalasi',
    Symbol: 'D',
  },
  {
    Region: 'Georgia',
    Currency: 'Lari',
    Symbol: '₾',
  },
  {
    Region: 'Germany',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Ghana',
    Currency: 'Cedis',
    Symbol: '₵',
  },
  {
    Region: 'Greece',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Guatemala',
    Currency: 'Quetzales',
    Symbol: 'Q',
  },
  {
    Region: 'Guinea',
    Currency: 'Francs',
    Symbol: 'FG',
  },
  {
    Region: 'Guyana',
    Currency: 'Dollars',
    Symbol: 'G$',
  },
  {
    Region: 'Haiti',
    Currency: 'Gourdes',
    Symbol: 'G',
  },
  {
    Region: 'Honduras',
    Currency: 'Lempiras',
    Symbol: 'L',
  },
  {
    Region: 'Hungary',
    Currency: 'Forint',
    Symbol: 'Ft',
  },
  {
    Region: 'Iceland',
    Currency: 'Kronur',
    Symbol: 'kr',
  },
  {
    Region: 'India',
    Currency: 'Rupees',
    Symbol: '₹',
  },
  {
    Region: 'Indonesia',
    Currency: 'Rupiahs',
    Symbol: 'Rp',
  },
  {
    Region: 'Iran',
    Currency: 'Rials',
    Symbol: '﷼',
  },
  {
    Region: 'Iraq',
    Currency: 'Dinars',
    Symbol: 'ع.د',
  },
  {
    Region: 'Ireland',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Israel',
    Currency: 'New Shekels',
    Symbol: '₪',
  },
  {
    Region: 'Italy',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Jamaica',
    Currency: 'Dollars',
    Symbol: 'J$',
  },
  {
    Region: 'Japan',
    Currency: 'Yen',
    Symbol: '¥',
  },
  {
    Region: 'Jordan',
    Currency: 'Dinars',
    Symbol: 'د.ا',
  },
  {
    Region: 'Kazakhstan',
    Currency: 'Tenge',
    Symbol: '₸',
  },
  {
    Region: 'Kenya',
    Currency: 'Shillings',
    Symbol: 'KSh',
  },
  {
    Region: 'Kuwait',
    Currency: 'Dinars',
    Symbol: 'د.ك',
  },
  {
    Region: 'Kyrgyzstan',
    Currency: 'Soms',
    Symbol: 'с',
  },
  {
    Region: 'Laos',
    Currency: 'Kips',
    Symbol: '₭',
  },
  {
    Region: 'Latvia',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Lebanon',
    Currency: 'Pounds',
    Symbol: 'ل.ل',
  },
  {
    Region: 'Lesotho',
    Currency: 'Maloti',
    Symbol: 'L',
  },
  {
    Region: 'Liberia',
    Currency: 'Dollars',
    Symbol: 'L$',
  },
  {
    Region: 'Libya',
    Currency: 'Dinars',
    Symbol: 'ل.د',
  },
  {
    Region: 'Liechtenstein',
    Currency: 'Switzerland Francs',
    Symbol: 'CHF',
  },
  {
    Region: 'Lithuania',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Luxembourg',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Madagascar',
    Currency: 'Ariary',
    Symbol: 'Ar',
  },
  {
    Region: 'Malawi',
    Currency: 'Kwachas',
    Symbol: 'MK',
  },
  {
    Region: 'Malaysia',
    Currency: 'Ringgits',
    Symbol: 'RM',
  },
  {
    Region: 'Maldives',
    Currency: 'Rufiyaa',
    Symbol: 'ރ.',
  },
  {
    Region: 'Mali',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Malta',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Mauritania',
    Currency: 'Ouguiyas',
    Symbol: 'UM',
  },
  {
    Region: 'Mauritius',
    Currency: 'Rupees',
    Symbol: '₨',
  },
  {
    Region: 'Mexico',
    Currency: 'Pesos',
    Symbol: 'MX$',
  },
  {
    Region: 'Moldova',
    Currency: 'Lei',
    Symbol: 'L',
  },
  {
    Region: 'Monaco',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Mongolia',
    Currency: 'Tugriks',
    Symbol: '₮',
  },
  {
    Region: 'Montenegro',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Morocco',
    Currency: 'Dirhams',
    Symbol: 'د.م.',
  },
  {
    Region: 'Mozambique',
    Currency: 'Meticais',
    Symbol: 'MT',
  },
  {
    Region: 'Myanmar',
    Currency: 'Kyats',
    Symbol: 'Ks',
  },
  {
    Region: 'Namibia',
    Currency: 'Dollars',
    Symbol: 'N$',
  },
  {
    Region: 'Nepal',
    Currency: 'Rupees',
    Symbol: '₨',
  },
  {
    Region: 'Netherlands',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'New Zealand',
    Currency: 'Dollars',
    Symbol: 'NZ$',
  },
  {
    Region: 'Nicaragua',
    Currency: 'Cordobas',
    Symbol: 'C$',
  },
  {
    Region: 'Niger',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Nigeria',
    Currency: 'Nairas',
    Symbol: '₦',
  },
  {
    Region: 'North Korea',
    Currency: 'Won',
    Symbol: '₩',
  },
  {
    Region: 'North Macedonia',
    Currency: 'Denars',
    Symbol: 'ден',
  },
  {
    Region: 'Norway',
    Currency: 'Krone',
    Symbol: 'kr',
  },
  {
    Region: 'Oman',
    Currency: 'Rials',
    Symbol: 'ر.ع.',
  },
  {
    Region: 'Pakistan',
    Currency: 'Rupees',
    Symbol: '₨',
  },
  {
    Region: 'Panama',
    Currency: 'Balboa',
    Symbol: 'B/.',
  },
  {
    Region: 'Papua New Guinea',
    Currency: 'Kina',
    Symbol: 'K',
  },
  {
    Region: 'Paraguay',
    Currency: 'Guarani',
    Symbol: '₲',
  },
  {
    Region: 'Peru',
    Currency: 'Nuevos Soles',
    Symbol: 'S/.',
  },
  {
    Region: 'Philippines',
    Currency: 'Pesos',
    Symbol: '₱',
  },
  {
    Region: 'Poland',
    Currency: 'Zlotych',
    Symbol: 'zł',
  },
  {
    Region: 'Portugal',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Qatar',
    Currency: 'Rials',
    Symbol: 'ر.ق',
  },
  {
    Region: 'Romania',
    Currency: 'Lei',
    Symbol: 'lei',
  },
  {
    Region: 'Russia',
    Currency: 'Rubles',
    Symbol: '₽',
  },
  {
    Region: 'Rwanda',
    Currency: 'Francs',
    Symbol: 'FRw',
  },
  {
    Region: 'Saint Kitts and Nevis',
    Currency: 'Dollars',
    Symbol: 'EC$',
  },
  {
    Region: 'Saint Lucia',
    Currency: 'Dollars',
    Symbol: 'EC$',
  },
  {
    Region: 'Saint Vincent and the Grenadines',
    Currency: 'Dollars',
    Symbol: 'EC$',
  },
  {
    Region: 'Samoa',
    Currency: 'Tala',
    Symbol: 'T',
  },
  {
    Region: 'San Marino',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Sao Tome and Principe',
    Currency: 'Dobras',
    Symbol: 'Db',
  },
  {
    Region: 'Saudi Arabia',
    Currency: 'Riyals',
    Symbol: '﷼',
  },
  {
    Region: 'Senegal',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Serbia',
    Currency: 'Dinars',
    Symbol: 'din',
  },
  {
    Region: 'Seychelles',
    Currency: 'Rupees',
    Symbol: '₨',
  },
  {
    Region: 'Sierra Leone',
    Currency: 'Leones',
    Symbol: 'Le',
  },
  {
    Region: 'Singapore',
    Currency: 'Dollars',
    Symbol: 'S$',
  },
  {
    Region: 'Slovakia',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Slovenia',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Solomon Islands',
    Currency: 'Dollars',
    Symbol: 'SI$',
  },
  {
    Region: 'Somalia',
    Currency: 'Shillings',
    Symbol: 'Sh.so.',
  },
  {
    Region: 'South Africa',
    Currency: 'Rand',
    Symbol: 'R',
  },
  {
    Region: 'South Korea',
    Currency: 'Won',
    Symbol: '₩',
  },
  {
    Region: 'South Sudan',
    Currency: 'Pounds',
    Symbol: '£',
  },
  {
    Region: 'Spain',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Sri Lanka',
    Currency: 'Rupees',
    Symbol: 'Rs',
  },
  {
    Region: 'Sudan',
    Currency: 'Pounds',
    Symbol: 'ج.س.',
  },
  {
    Region: 'Suriname',
    Currency: 'Dollars',
    Symbol: 'Sr$',
  },
  {
    Region: 'Sweden',
    Currency: 'Krona',
    Symbol: 'kr',
  },
  {
    Region: 'Switzerland',
    Currency: 'Francs',
    Symbol: 'CHF',
  },
  {
    Region: 'Syria',
    Currency: 'Pounds',
    Symbol: '£',
  },
  {
    Region: 'Taiwan',
    Currency: 'New Dollars',
    Symbol: 'NT$',
  },
  {
    Region: 'Tajikistan',
    Currency: 'Somoni',
    Symbol: 'ЅМ',
  },
  {
    Region: 'Tanzania',
    Currency: 'Shillings',
    Symbol: 'TSh',
  },
  {
    Region: 'Thailand',
    Currency: 'Baht',
    Symbol: '฿',
  },
  {
    Region: 'Togo',
    Currency: 'Francs',
    Symbol: 'CFA',
  },
  {
    Region: 'Tonga',
    Currency: "Pa'anga",
    Symbol: 'T$',
  },
  {
    Region: 'Trinidad and Tobago',
    Currency: 'Dollars',
    Symbol: 'TT$',
  },
  {
    Region: 'Tunisia',
    Currency: 'Dinars',
    Symbol: 'د.ت',
  },
  {
    Region: 'Turkey',
    Currency: 'Lira',
    Symbol: '₺',
  },
  {
    Region: 'Turkmenistan',
    Currency: 'Manats',
    Symbol: 'm',
  },
  {
    Region: 'Tuvalu',
    Currency: 'Dollars',
    Symbol: 'TVD',
  },
  {
    Region: 'Uganda',
    Currency: 'Shillings',
    Symbol: 'USh',
  },
  {
    Region: 'Ukraine',
    Currency: 'Hryvnia',
    Symbol: '₴',
  },
  {
    Region: 'United Arab Emirates',
    Currency: 'Dirhams',
    Symbol: 'د.إ',
  },
  {
    Region: 'United Kingdom',
    Currency: 'Pounds',
    Symbol: '£',
  },
  {
    Region: 'United States',
    Currency: 'Dollars',
    Symbol: '$',
  },
  {
    Region: 'Uruguay',
    Currency: 'Pesos',
    Symbol: '$U',
  },
  {
    Region: 'Uzbekistan',
    Currency: 'Sums',
    Symbol: 'лв',
  },
  {
    Region: 'Vanuatu',
    Currency: 'Vatu',
    Symbol: 'VT',
  },
  {
    Region: 'Vatican City',
    Currency: 'Euros',
    Symbol: '€',
  },
  {
    Region: 'Venezuela',
    Currency: 'Bolivares',
    Symbol: 'Bs.',
  },
  {
    Region: 'Vietnam',
    Currency: 'Dong',
    Symbol: '₫',
  },
  {
    Region: 'Yemen',
    Currency: 'Rials',
    Symbol: '﷼',
  },
  {
    Region: 'Zambia',
    Currency: 'Kwacha',
    Symbol: 'ZK',
  },
  {
    Region: 'Zimbabwe',
    Currency: 'Dollars',
    Symbol: 'Z$',
  },
];

export default currencyData;
