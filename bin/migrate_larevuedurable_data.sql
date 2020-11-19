-- This script will migrate from the old data structure to the new one.
-- It assumes that old tables and new tables are in the same database, side-by-side.
-- New tables must already exists and be up-to-date.
--
-- A quick way to ensure all those assumptions and do the migration are the following commands:
--
--     ./vendor/bin/doctrine-migrations migrations:migrate --no-interaction
--     gunzip -c data/cache/larevuedurable.com.sql.gz | mysql -u artisans -p artisans
--     more bin/migrate_larevuedurable_data.sql | mysql -u artisans -p artisans
--     ./bin/clean-formatted-content.php
--
-- Files can be migrated with something like the following. It will only copy the original image, no thumbs, into current project:
--
--     find /sites/larevuedurable.com/htdocs/img/p/ -regextype posix-extended -regex '.*/[0-9]+\..[a-zA-Z]+' -exec cp {} data/images/ \;
--     cp /sites/larevuedurable.com/htdocs/download/* data/file/ && rm data/file/index.php
--
-- Later on things can be cleaned up with the help of `./bin/check-files.php`

START TRANSACTION;

INSERT INTO user (id, creation_date, update_date, first_name, last_name, password, email, role)
SELECT id_customer,
    date_add,
    date_upd,
    CONCAT(UCASE(LEFT(firstname, 1)), SUBSTRING(firstname, 2)),
    CONCAT(UCASE(LEFT(lastname, 1)), SUBSTRING(lastname, 2)),
    passwd,
    email,
    'member'
FROM ps_customer
WHERE deleted = 0;

-- Assume all image exist on disks
INSERT INTO image (id, filename, mime, width, height)
SELECT id_image,
    CONCAT(id_image, '.jpg'),
    'image/jpeg',
    0,
    0
FROM ps_image;

-- PrestaShop have duplicated records for same file on disk, so we use `IGNORE`
INSERT IGNORE INTO file (id, creation_date, filename, mime)
SELECT id_product_download,
    date_add,
    filename,
    IF(filename IN (
                    '0513b4a3334d06950593bd573d32be875a672c72',
                    '13b08fe77934d106f1a6079dccd34c40f8314aff',
                    '180ef3e990772da08289d0e7b1ff7e11bd80876b',
                    '2e5d8f40fbeb61de8b6a7ad551f0241eac20c3bc',
                    '41854fe4dfd4b4b4352bbd2e81a0869f72ab9c4a',
                    '8d55eab43fd082ce45f39a233f3bf5724777fecf',
                    '96a3082aa6f3b5f6f9268e407dbc19bd113012f0'
        ), 'application/zip',
       IF(filename IN (
                       '0a04fafaf1e018ee2df33e09eac5d91cebc483f5',
                       '0faed7343c23a920e5d30fdfd5e37f23e7c75266',
                       '16581c333db02986c069b72cfe99f87c4e95cbfe',
                       '1b88743a5baab4188b8b70f9637a7114f0d3edc6',
                       '3ad53052f54e424bbd6e535c2a0959497c914fb1',
                       '53394d663ecc3fab39793ab374c905f1d1fc6288',
                       '638ed359ac9c9aaea2bad5fee462aedfc2f81d2b',
                       '795f67656775c0a7349ccf7ea7e3a08ddd048cb2',
                       '8a944e5102f68ee245b02f88bad4cd4c878bf0b7',
                       'b165731bcf4464f2e061257ad0fcfeac4994e2ce',
                       'f37fcbdfe367fd418a600c196c969e816261b502'
           ), 'image/png',
          'application/pdf'))
FROM ps_product_download
WHERE filename NOT IN (
    -- This is a list of file that do no exit on disk and thus should not be created in DB at all
                       '01131b739fe20de46c555c55289f6d25cb4433d5',
                       '032b1466c57b9b091960bffc34834a4d86dff9b6',
                       '04ed585f81c46ddfe987631afac7bc019079bdcd',
                       '05559a5d73f3033dc89f94d263c2dbdeefd5b302',
                       '05c67085923703cd8ab5391ded95a3fbc5fc49f6',
                       '066fce30f0ccc658f67183f6d9bd359551cfa9cf',
                       '06bab67814f8e697eb29ada571bc9410ca3b124b',
                       '06cb893421e7ad97a0436e55d0c6d1a0f7669c89',
                       '0862537e59e22a10a81684f4b639fea1a3c9d293',
                       '090c23c10f26a7fcf95119076e9340e9bc083808',
                       '09b362548c1a6cd7bc472512dfc03487b9ee2a76',
                       '0a0015f1c5e880571abffb9bdef90e9df27e98f1',
                       '0a4ba8162cad2bc8a21d08072f2d21ed2cd55da9',
                       '0ab1425566b6c01f4f39b1c9851d2c9eb17fc7cf',
                       '0af1fbebaa39fba0bb6b56d90d4f99b230da4021',
                       '0afdbddde98afcb3388b80fe733064b6b9dca5d4',
                       '0b90870a1af9824dc09448d52dc5369a1e3dd916',
                       '0bef3b126bad35b152afa64039cd9a8eedabb558',
                       '0ce540c29b49ea44d2747fbb6be114b28b66fae3',
                       '0d927c7755bf0e3f7a12a86c18be91c3c0c66657',
                       '0e6f451efa7ed753f6a9382ce146c2d98831b658',
                       '0e775e47a2d60f1a57d6eaf2114650bbda81b0c3',
                       '0e7841e502880a705aa97f79c45beb0c61e63cff',
                       '0e928d62be5cd32fc2fbc6e95ed894f4fb4b58a8',
                       '0ec675013deb2e3b67331e88f2c1f7ef665b5f2f',
                       '10873192fd6e84443c380baeb8efa51c93e4d267',
                       '11add3cca16da2c17e643a193c4783c64ddf0fa3',
                       '11e298f34f03cd00ac0def903f03959a3b4ac729',
                       '126925580e6739b40518e23675f6fec9ea839cbd',
                       '12ba8d140870b54d3f462773e66d7af7b3ad672b',
                       '12d8cdfd7fa2a81bb4261c64d28787d6c21ab842',
                       '14558fde5768a580367b9549e3dcd25d247f7718',
                       '14c41df706f74a1dbc8dc59b7be3636598deb69a',
                       '15c66bde41829ec8b27b824b835b34ae39594557',
                       '16bf15e8f68ffa0bab24df200e26eb8c764a601a',
                       '171cbcefd822555889854e20dbdea42767a64c4a',
                       '173b9d7690c709a4e292a348cbc310b9890e8581',
                       '1744e4d056c93d9629e2a53e0bb89222b66884e4',
                       '175b97d661881262a4dfa5e3149dfbe079ae4036',
                       '17e6282ae1c1216fee7bc2e7b878faf6406a8952',
                       '19695c3c24e920e19ab1721470c3ee8e51448721',
                       '1a0dc0871fec867dd790568fdb51851563546e81',
                       '1a6d23d9b0a7d888e0fc7fa7a61679eb0162e12c',
                       '1c574009b68da6befbde990f3d5dc171139b2bda',
                       '1c8dcedfc3211fd6f9c7fd78b69aee0f6db45409',
                       '1d32d1ada48aa4c5212a5dd43cb6b658aa780192',
                       '1e296329149a788bef6897f2e23be0ec05260dc7',
                       '1e98b23583ab6009bcd26e596886f065d941ae22',
                       '1efab850a0f17e110d85e26d64578eb939600103',
                       '1f1526cf991009ccf9ede35812cd7d78129bfb63',
                       '20463fd6faaee414093d02daf1bad1a0eefb3239',
                       '20674ca142338657e4afb2c475671781d236007c',
                       '208ea3579e8f132a4b52d871de2efd1a9074ebf4',
                       '2177eb0a2a0d761aa6cb04098540040cd7f01af7',
                       '22063d8cd5492aa812245d79d5954dd4eb618f06',
                       '222cf10314543a9bf2ca1af3ef0473e4a7ada3a1',
                       '22fce1e4eed90449a2a4b680f56ed5cb76053ece',
                       '24b3176ecdedfe7b668e3c7d1a14b26ad0f0f99f',
                       '25c90418ec7b9aba32a860566fad489bde8303d5',
                       '26894392b2ddbc89e9ad3a30534edd7abd50ebdc',
                       '2afc990e703f16f7553e97c125438a41bb95a78e',
                       '2b1d15c0d9329116b6787a285d6e576fa57f0f60',
                       '2c2c3688b51a97f034024426c5ebb418f2de78d0',
                       '2c3e73c30a4368c282128ba9ef56137513974f3b',
                       '2d5c198de09f9082652314ace81983b2201e8fdc',
                       '2d839f90c8037fc2baeee364e9cf90046ddf7089',
                       '2e4841cbb71728232794979419c1e19dc4372114',
                       '2ef727048a9333b7d00a2cc778aeb0ec9834ea38',
                       '2f18297ce1732870720cad2b38ec0c37a439c81a',
                       '30a0ac849306d50455dfb593b6ea76c500659bd2',
                       '30ace80f0aacf3ee431133bc58ea7ed7b8a5b638',
                       '311e1c1a9d08549f37f6438f9a48e251a2336d74',
                       '32d07138dc71830eba31b55d37cad812860f0446',
                       '33614d9aa469c82f45df0eaba81c1c19a9aa935e',
                       '339ce8fffb4bab13480c1783d9a54ce014137e1c',
                       '33ba7729e2f8cbdebb66f1a1562d2e6bdfac5efc',
                       '35af528845e3c907cb7d84eba9a645c0128f4b4c',
                       '36817d3200099ea7978df0d76dd72cf9b0733422',
                       '36b63f0605cedb458e1c6d17086ad0c82644a28e',
                       '3ad02cff599fd613482b56003c982a72febf6fa3',
                       '3af61cb4b20999af3d1111ba03235dbca14f1cf2',
                       '3b7769af537694519727a6605948f6d4499cdd22',
                       '3bcf3985789393ca2f921a14a82d53dd41c1a46c',
                       '3d4020f454868457be607830d116d9397d5bf33a',
                       '3f1f44da37f685b9e1021c89888dbe7b6cb48735',
                       '3f2ae92a300a6d1ae4c882fa8a8d28d0208fe140',
                       '3f43fb14d65d93b80103da5029c49d7dff2b17f2',
                       '3f64d2a04fd0dbc8ba5d51a184de3a2eb62ec93b',
                       '3fb73f52c012d2c2fe9bdd1a973f10e8b0fab850',
                       '402be5e7d7ad817e7cc0363239763c2b2d28ae51',
                       '40939c54e1dcaca0cff04bd528efc6347718bce4',
                       '40b38e26146d555b35129fe3dba9cf24a51336b2',
                       '40b6362324d058e7bdb2ec0a62ece3b0e3ef2200',
                       '41a66deee756499770b04d345c73780a040b75f0',
                       '420562955b958d0a38178b4afce1f4945e56b0c7',
                       '420d5b36279e0436f19e3351e0923215c6ce2014',
                       '478961f501ba524ae99c8783ae489fe425622859',
                       '478d0035df7b85c4f486c68da0580cff8326dfc1',
                       '47f68ca4ca428e3ea09ab00a75c4d666b6566e1a',
                       '481736ad386ebd7f7a47ed16a4bc2b16fb1f7400',
                       '483e98ae1c43ed62510c6754d342efef41ac004c',
                       '48bb764b2f17123c6b1aecdfdb187245f0622fa1',
                       '495ffd982fe01956014eac134341e436eb39ddb9',
                       '4ac3d91e0d56dcf48102add5790997e37e0cf232',
                       '4c524c0bced27293741fc08051de4b610fce1ecb',
                       '4cb87623ba5ecd2c084bf38ad83f9f8d99b21caf',
                       '4f495862afc6490ecb700d352f7b26931cabd201',
                       '501a9d986df7435eec46c802675d73b9890c883d',
                       '505ee103ce468ce53ba7ba44aa2088f3db7ef65d',
                       '535dcd72a043b498fcef85efb66d13cd3b6a351a',
                       '5501f950c7ddccbfb9633f1bc0910216fa4d173e',
                       '56ab43adff9c263f07d1d7ff397255aa6bf3a8f5',
                       '57ee25d63fc9f25da01fa33fd1e75f73a9f7f9d5',
                       '58213832236ae8678b32d4644eaf64a6e11fdba7',
                       '5880da2022e4b76e0da7ad8665fbea2da4cf8814',
                       '59f738873f4bd1fb856c52c63aa1f697c9eb7959',
                       '5a3d3abd0c34fd35575f208ca05481f5fe211ce1',
                       '5b067da6b204131f053b867fb41d5d38d11e5406',
                       '5e330873823fadea5817b97cb39a404f63a17c36',
                       '5ed1e6adf4108d704dd80d74f58a56c59031dd74',
                       '5f130022d0d926c640eca62bbce42bcf07d5ca12',
                       '5f1ce8fe00ee1dbac8738c4d25c5d360197827e7',
                       '5fba0976fac9253ad2b1c88e1fbb2a1d15b59e15',
                       '60ce29c98f1a4fe42e6fcf8dd0d2b4f12a924b59',
                       '62e418b463d77e8704551278a118bf3972d1dfff',
                       '640baa2dcc9b92c7e88366a685c9c9d73c9bde0a',
                       '65ca354fa280c91078ec7f1e9c392e87a4e169ac',
                       '665e0ac9d2e909e40c4c5604737fc0693a026a02',
                       '66c80af713561fa5176110b4a69e307e986288e7',
                       '689c531ab3f11eb6e8723eaa3bb2a043e3a151d4',
                       '692af29fcba9bd6fa9ac7ce0de1bf5ea10368321',
                       '69446cbe7d47aa5c1d1915a644c2a93da3358fdb',
                       '697e5cd8a6df3aa096886c13931ba4a88640104e',
                       '6aaab823c47e1bee942355c6ac6fefe2d7668d06',
                       '6b4004bd34f324611785ffc4567f6bcfde1cb04b',
                       '6d1b0ccd86feeecd1c62e21da8e8b178ced4c409',
                       '6d3ea62de714c91fe29ed0ef425635615b90707e',
                       '6d7ac3e42228518fbe8a03b4413b3951fb0a9305',
                       '6f7616b4c9b2437b19f588d013c5afa6b5f12c1b',
                       '703342e22ccf936396d4bb570bbd29c5e3def6de',
                       '709661776e9bb12ea1c1808077ff0ada9024f129',
                       '70d093fede96980fdb18e6090287f8d0c76f7ea4',
                       '70f626bb32cd0122b752fd2c74e548b24fd0ecb1',
                       '70fedbb5c0d358d45df912ce5d2b70da17e25a93',
                       '73fb55a907b88ec70ef4fb8315149af0cff077ec',
                       '7526a4245b55f0d485b32e87551cddd8134f8b1f',
                       '76a3ae7514f463a45929952aa61819bb4520b249',
                       '770ac7a099d58aee12d396486e10d3bf6a19bb02',
                       '77d0dadc34df6fff3ac0aafc9a21bad2c46a8bcd',
                       '77d68ace679bb0c5264b4f1e9f2df6e055ec2e3f',
                       '78ef581f0fa9f8ecd5876f574e1450c76ff6b420',
                       '794bc8d99500d7082990316252a4a7cd94809bda',
                       '7963f8656e923c56d156151910c7baabae7f0573',
                       '7af0f72a28eb8a3b9f01f7502c3051bbd91f4143',
                       '7b47501251bbd09416ae1360a87c1d1c11e34331',
                       '7d189cab93f6c2bea5d57fd18c750a23aaf5eafe',
                       '7e734f2fed187da1041fef3c0c5fad12bd516350',
                       '80da8ebcc8e6d9ad5204500069c7e66220ff1e2f',
                       '8190c85a4ff0f2b06cbfa81cb68fc0e9f6e75ee6',
                       '83733d9e476dfcf86f2a7f82a131a671bbfb17a5',
                       '8480e61ba47c3445d26de4469af52ec5de9f1ab4',
                       '848b7b997f9f489c589c15a765c3c6edf840912f',
                       '84c11d65d263ab70d978b1801c3bc8a8f0a57ccf',
                       '85a0d86e3a30c0558d4eee6cfa7e3386d777bd24',
                       '879240276557ed23b7321724ad507eefc142e80f',
                       '87cefe774b1f91fc37444a7603dc65b2b83aea09',
                       '88813fcd3487d6e2133eb221004c28f65e24edbf',
                       '88c03abf93a8587e1b62885c25906ca00a52d638',
                       '8a807eca33a545c833c03c5221c60e391f0bdf24',
                       '8c968c0d9a9f9c1e80e7120f9a20c87c2ae006d1',
                       '8d52b155ce849a5d4259e463538af5d144d72527',
                       '8df07f6ce91f9df23173d96f0cf9c99f4db9faf1',
                       '8e009f0298e52ffbb7f789c1ac29d4e62deb1395',
                       '8e4f336e052dfa25c7359e4627b036044c2e79c0',
                       '8eea3cceedaba99538884af3f1fb1511be8ea5a5',
                       '9176f5d9055cd4e57ca58b79959c896d488d4899',
                       '933a9b1d2bd32a9299a27282c9cf25a88dc6ccba',
                       '947abdaedbb6b215d92dc90700c4e116b8b3a532',
                       '94d39809377fb108d30f9516c9ecc1833efe9f6a',
                       '958a48f0f8b0d8efa9bc7f182377a4d449a6851f',
                       '96f4a050877d8f52a8942f41f0634d2ec5cccf62',
                       '97cf61cd418210011c7cc4e4039c6b4c5bbebd53',
                       '98652bc6415aa0513c319bd9630ee4dc1e16e315',
                       '9868ff6049df85baa835936087d6080b91063609',
                       '98fdbe3026700ab494747f25b12ec937f7b47b3a',
                       '99a9fa9da0d15a19b43d545ea1364cb38cd23625',
                       '99c3142b6c925c01b311be1ed837db3b3df8872b',
                       '9a3a8a2eb33a81839e2d83c2d2c3536a00a143b7',
                       '9ba0424fd57eaf3954b433f570c972c9b0e3114f',
                       '9bfbcf36b46665eeb0ad550d00d27c49f792b256',
                       '9c6ee63ab8a90e6785429773a38755918069ebfb',
                       '9d5824558e13add2b77336bed962545ce0faebf7',
                       '9da8a0b9b906324c89ada3c6974c437e75d2208a',
                       '9fc1aa7d386aaa8381c19837fb565030ba7d78c8',
                       'a00b8c02666f8283de2c316c0e6835a65fbf13e4',
                       'a0f992a43cd2cfed42cce6065040ed0d5c82d533',
                       'a300cae97e363df5178434aa2c9edd52dc797f34',
                       'a70a1f1224f03a4c2556b71a40f4a5fe9ea5e215',
                       'a78d001cb96453a3d810f9b40211a58f06a1d38c',
                       'a837e8514545e0b15dc392107d3b9d0e20c17ba2',
                       'a86a6c3835f1bc257d353307a2607bec0ba4d1a8',
                       'a955b6df53e431121ef021f064dca4a58849b897',
                       'ab160e02b829a42b34d9e029882b5c15630ec600',
                       'ab47afb4f7d568b8a4ed57b808d25fab1ca2b569',
                       'abf237321002edead2b89724a66ef58e579a147c',
                       'ac5e0dd0011388da04acb272af3cc786443abd9f',
                       'adc82d1c2e4f91f4264665fddeec35bd2049361c',
                       'ae06bed75356d709fd6d9ba20797caf0098c35cc',
                       'ae76ce7ca8297350e25830e3b067230ded84ac97',
                       'ae9f6d287548bf8d0bab860d226b71b6ac2c0448',
                       'aeacd25fefa9bce42099be91df8d5ac16c048977',
                       'aecab854dafb4449842ad0009bbe954a7bde5237',
                       'aedc501379b071f4425b57bc1a0964b147c82b3a',
                       'b104d185736e1a20f88184854647480877e5aff5',
                       'b11dc729fba8f91e993865cc8e24c3d3b791c537',
                       'b2a4c009daaa76a69c48e479fac742ec1289d6c3',
                       'b2da198d6e268ac1e4179006b1efb625db33d11d',
                       'b34f2c0e475a106da3beb003020190d426a3ecbb',
                       'b451369fb2a182f80756cc7157792155da879c94',
                       'b7d296f337130d65fe53d410a58d87f34ba86b66',
                       'b7ff7ff3e416c71e133d706e1beb8f55addefb30',
                       'b869edbb70a78d7e2e0cddf6c72a7519bcc185d9',
                       'ba9fa7011f0eb9943dd322fdff19897f8d727041',
                       'bbd1e1e61d71166a1a66bd3c325de53916336ffc',
                       'bc07ee02f3d1264c1ccc727362b58e0a017ec149',
                       'bc351af31f08dcb1cf1d821fdcaf637ae28c2189',
                       'bc4d0dc3128bf57b7d11f967d3f86a22254825a6',
                       'bcc82278edd3704ae7a6f5c13a43e1eef311cc37',
                       'bcda50a2968327f399cb89d23a4f150df6c26b5d',
                       'bce8632b92e7f5c2ca36eccbe7fddfe8598682c9',
                       'bd55515b3a31993a039ffb54c2d3f7ff3f55475a',
                       'bf63bcbb6bdac15897569ffefacb612293f3c4ab',
                       'c358ddbfca183c272b1794f51e1b761abf95f45e',
                       'c515b5665640129612eb3a0507d2d18e4205f769',
                       'c52e81fc931c0582915f2b100a2a17fff66d66ba',
                       'c5e092894042eb0323293bb4a498903bc28dd0e5',
                       'ca3b0ebc3444664a44ad6a26b7380e7ad39fc3da',
                       'cd5f468e1356d1d7781d884e5e7f929d07cc82bc',
                       'cd7728694848dc6e52155a0b89c20f06f63ada3b',
                       'cdec362695a07ef8b37f5a56a5a091bd48d83013',
                       'ce1d526774ffb0d51bf1658562431ac479dae545',
                       'ce7289f9b1e157fb240eb49b7e4118c8df76b81a',
                       'd052e98b364dc9aa64a32748bedc251450e8423a',
                       'd10ab54dc24438d54278257c41a40704ea543799',
                       'd1b8e504a413c13ac98d3804a31ffd40a7333647',
                       'd27224eaca63969dd53c183df7888ce63876a070',
                       'd5b553f9f51420c99774b9195a48e304808de2a0',
                       'd639635a07d6ac03815ea8e6513c4f7891606efb',
                       'd65f95ac434696c249f46a10411caf5298eff90e',
                       'd666770cdf9eba94f1af7b7cf1376b9c7beb68c8',
                       'd6c64c9eb38e3e8a244bf88952a8dee3a117fba4',
                       'da33cf1c4bcdb912883f720c58b65a92eef72307',
                       'da77563fd6cd3890fb8cfad4a9ebfd988565d018',
                       'daf46af398655734adec4b5fbe5bd884d6a0b44d',
                       'db3ac37557d9f05ef37e2d65641d537c31313f51',
                       'dda8b27df5aef141939c649584a8d72ca3a29862',
                       'de0aa5abed99adf253d3c3e2daa7b6b7ebfe2f51',
                       'df0e3da43103c0e51cf466cf185b23e8327486b1',
                       'df9058804566155c2188519df92ca8b53c447729',
                       'e0f6f043a1e4dd4085d2879b94ccebbd696fca77',
                       'e1113db170ab1cc5c69fe6c9c0f17c474e531fa2',
                       'e1135e641b67984c9ec8ca0085fe4b97173596da',
                       'e23762d771653ff2ad17533ef756032e80c3e004',
                       'e29370c64cf8d937f2d40fff67cce5c21e164873',
                       'e2e20aee0bbe50f14ed03652b71e1e29a14aff14',
                       'e326d11647b0d936fdf6ffdad67470b88c11a417',
                       'e4718ec9c5d2111e2ca410eaa7511f05988ab3ee',
                       'e4ffacfbe7e993a9769bfa84aa14678c726b892c',
                       'e542bd65794afb8a7155a6ad8d679d7acb62c727',
                       'e73d438550f7f6d3d7f28687223327a516e8ae06',
                       'e7befaae45e1d4a127eda756d8b599a93a4763fd',
                       'e7fc6e31e6ba2696648bcc866aa066ff3ff2bfd9',
                       'e8775bbac88be96609e2e3ecc28ef5d64adb2930',
                       'ea8931c1f6e759015bca0da8960b2c76710d83ae',
                       'eb67e683f71236c8afb9cf5d001f3dfc3fe7cf46',
                       'ec13b584f3456f013acc669634f8c58cf6485e08',
                       'f1679ee515e17f84ab6376597c5423f12fb31d6e',
                       'f2f6fc221bc30e4c688b88e753dba42ab85298cc',
                       'f396fe546afd2ca5f24aed955d89a4f86cfde168',
                       'f3c49e1b14024f3851b4d893f546d29508abc3c6',
                       'f4c7dca76785c259d18262a087ab5d49ee36b0d3',
                       'f8215eb4264459c9760d51e292d00099f6dc194e',
                       'f8cd91c1f4525738cf3b7e05ef65658ad840c3d4',
                       'f914d3c81209b0a26d371a1dbff0415e842eeafe',
                       'fa1a65e461f3b4ca69070e8dce4db803160b8580',
                       'fa87bdaee74a2444a4edcd266b634cf60553b910',
                       'ff7b6d63fa7974d6f3e79678e3bef75d41daaef2',
                       'ffdbe7986c82ed16b7472168613bc8acc686fd26',
                       'ffea7d181644e5a09c4ba3f71d5ff1862dd289f1'
    );

-- Manual fix for a few references
UPDATE ps_product
SET reference = REPLACE(
        REPLACE(
                REPLACE(
                        REPLACE(
                                REPLACE(
                                        REPLACE(reference, '053-16', '053-016'),
                                        '058-17', '058-017'),
                                '058-46', '058-046'),
                        '061- 003', '061-003'),
                '061-62', '061-062'),
        '062- 003', '062-003');

INSERT INTO product (id, image_id, creation_date, update_date, price_per_unit_chf, price_per_unit_eur, name,
                     content, code, internal_remarks, type, description, is_active, reading_duration,
                     release_date, review_number)
SELECT ps_product.id_product,
    pi.id_image, -- Assume the image exists on disk
    ps_product.date_add,
    ps_product.date_upd,
    (ps_product.price + ps_product.price * 0.025) * 100, -- Compute CHF price including tax
        (ROUND((ps_product.price + ps_product.price * 0.025) * 0.73 * 4) / 4) * 100, -- Compute EUR price including tax
    REPLACE(ppl.name, ' (version papier)', ''),
    IFNULL(ppl.description, ''),
    IF(ps_product.reference = '', NULL, ps_product.reference),
    '',
    IF(reference REGEXP '^\\d\\d\\d$', 'both', -- Reviews are both
       IF(reference REGEXP '^\\d\\d\\d-\\d\\d\\d$', 'digital', -- Articles are digital only
          'other') -- Anything else ("Vignette cuisine")
        ),
    IFNULL(ppl.description_short, ''),
    ps_product.active,
    NULL, -- This information did not exist before
    ps_product.date_parution,
    IF(reference REGEXP '^\\d\\d\\d$', ps_product.reference, NULL) -- Only reviews have a review_number, articles don't
FROM ps_product
         INNER JOIN ps_product_lang AS ppl ON ps_product.id_product = ppl.id_product AND ppl.id_lang = 1
         LEFT JOIN ps_image pi ON ppl.id_product = pi.id_product AND pi.cover = 1
WHERE ps_product.reference NOT REGEXP '^\\d\\d\\de$' -- Never import digital review, instead we will import paper and mark it as `both`
        AND ps_product.reference NOT LIKE 'abo-%' -- Skip subscriptions because they have their own table
        AND
        ps_product.id_product NOT IN (
                                      1258, -- Because it is a duplicate of 83 with both the reference 045-061 and this one is not active
                                      782, -- Exclude all "Recharge"
                                      783,
                                      784,
                                      785,
                                      786,
                                      1024, -- accessible qu'à la recherche, pas importer car on n'a pas ce type de mécanisme
                                      1025,
                                      1026,
                                      1027,
                                      1028, -- plus de bons cadeaux, ca passera par un contact direct avec eux
                                      1083, -- semble être un doublon, ne pas importer
                                      1143, -- n'est plus un produit, mais une feature, ne pas importer
                                      1236, -- ne pas importer
                                      1142 -- la cotisation est déjà un produit chez nous. Ce produit n'est donc à priori pas à importer, car l'ajout au panier se fera par ID hardcodé comme pour les abonnements
        )
;

-- Link articles to their reviews
UPDATE product
    INNER JOIN ps_product AS article ON article.id_product = product.id
    INNER JOIN ps_product AS review ON review.reference REGEXP '^\\d\\d\\d$' AND article.numero = review.reference
SET product.review_id = review.id_product
WHERE article.reference REGEXP '^\\d\\d\\d-\\d\\d\\d$' -- Only articles
;

-- When linking product and their PDF, we cannot rely on product ID because some ID are missing in our DB because of duplicated records in PrestaShop

-- Link products to their PDF via exact reference
UPDATE product
    INNER JOIN ps_product ON ps_product.reference = product.code
    INNER JOIN ps_product_download ON ps_product_download.id_product = ps_product.id_product AND
                                      ps_product_download.active = 1
    INNER JOIN file ON file.filename = ps_product_download.filename
SET product.file_id = file.id
WHERE product.file_id IS NULL;

-- Link products to their PDF via reference of the digital version
UPDATE product
    INNER JOIN ps_product ON ps_product.reference = CONCAT(product.code, 'e')
    INNER JOIN ps_product_download ON ps_product_download.id_product = ps_product.id_product AND
                                      ps_product_download.active = 1
    INNER JOIN file ON file.filename = ps_product_download.filename
SET product.file_id = file.id
WHERE product.file_id IS NULL;


INSERT INTO `order` (id, creator_id, owner_id, updater_id, creation_date, update_date, balance_chf, balance_eur, status,
                     payment_method, internal_remarks)
SELECT id_order,
    NULL,
    id_customer,
    NULL,
    -- Creation date cannot be trusted, because it sometimes is far in the future (!), so instead we first try the invoice date,
    -- then only take creation date if not in the future, if all fails, use update date as creation date
    IF(invoice_date IS NOT NULL, invoice_date, IF(date_add <= date_upd, date_add, date_upd)),
    date_upd,
    IF(id_currency = 1, total_products_wt, 0) * 100,
    IF(id_currency = 2, total_products_wt, 0) * 100,
    IF(ps_orders.valid, 'validated', 'pending'),
    CASE module
        WHEN 'bankwire'
            THEN 'ebanking'
        WHEN 'bankwirebvr'
            THEN 'bvr'
        WHEN 'datatrans'
            THEN 'datatrans'
        ELSE -- Assume everything else (cheque, free_order, prepayment) is ebanking. This is a loss of data, but should be acceptable
            'ebanking'
        END,
    CONCAT('Référence selon PrestaShop: ', reference)
FROM ps_orders
WHERE id_customer IN (SELECT id FROM user);

INSERT INTO order_line (id, owner_id, creation_date, update_date, order_id, name, is_chf, balance_chf, balance_eur,
                        type, product_id, subscription_id, quantity)
SELECT id_order_detail,
    ps_orders.id_customer,
    -- Creation date cannot be trusted, because it sometimes is far in the future (!), so instead we first try the invoice date,
    -- then only take creation date if not in the future, if all fails, use update date as creation date
    IF(ps_orders.invoice_date IS NOT NULL, ps_orders.invoice_date, IF(ps_orders.date_add <= ps_orders.date_upd, ps_orders.date_add, ps_orders.date_upd)),
    ps_orders.date_upd,
    ps_orders.id_order,
    ps_order_detail.product_name,
    ps_orders.id_currency = 1,
        IF(ps_orders.id_currency = 1, ps_order_detail.total_price_tax_incl, 0) * 100,
        IF(ps_orders.id_currency = 2, ps_order_detail.total_price_tax_incl, 0) * 100,
    'both',
    IF(ps_order_detail.product_id IN (SELECT id FROM product), ps_order_detail.product_id, NULL),
    NULL, -- Subscriptions are never migrated so cannot be linked
    ps_order_detail.product_quantity
FROM ps_order_detail
         INNER JOIN ps_orders ON
        ps_order_detail.id_order = ps_orders.id_order
        AND ps_orders.id_customer IN (SELECT id FROM user);

-- Only import used categories
INSERT IGNORE INTO product_tag(id, creation_date, update_date, name, color)
SELECT ps_category.id_category,
    ps_category.date_add,
    ps_category.date_upd,
    ps_category_lang.name,
    '#f6a990'
FROM ps_category
         INNER JOIN ps_category_lang ON ps_category_lang.id_category = ps_category.id_category
         INNER JOIN ps_category_product ON
        ps_category_lang.id_category = ps_category_product.id_category AND
        ps_category_product.id_product IN (SELECT id FROM product)
WHERE id_lang = 1 AND ps_category.id_parent = 6;

INSERT INTO product_tag_product (product_tag_id, product_id)
SELECT id_category,
    id_product
FROM ps_category_product
WHERE id_product IN (SELECT id FROM product) AND id_category IN (SELECT id FROM product_tag);


-- Employee that already exists as customer are promoted to admin
UPDATE user
SET role = 'administrator'
WHERE email IN (SELECT email FROM ps_employee);

-- Insert new employee as users
INSERT INTO user (first_name, last_name, password, email, role)
SELECT lastname,
    firstname,
    passwd,
    email,

    CASE id_profile
        WHEN 1 -- SuperAdmin
            THEN 'administrator'
        WHEN 2 -- Administrateur
            THEN 'administrator'
        WHEN 5 -- Commercial
            THEN 'facilitator'
        WHEN 6 -- Administrateur LRD
            THEN 'facilitator'
        WHEN 7 -- Membre LRD
            THEN 'facilitator'
        ELSE -- Assume everything else is member (it should not happen)
            'member'
        END
FROM ps_employee
WHERE email NOT IN (SELECT email FROM user);

INSERT IGNORE INTO product_product (product_source, product_target)
SELECT id_product_1,
    id_product_2
FROM ps_accessory;

-- Migrate into news everything not in category "Agenda"
INSERT INTO news (id, name, description, content, date, is_active)
SELECT ps_prestablog_news.id_prestablog_news,
    ppnl.title,
    ppnl.paragraph,
    ppnl.content,
    ps_prestablog_news.date,
    ps_prestablog_news.actif
FROM ps_prestablog_news
         INNER JOIN ps_prestablog_news_lang ppnl
ON ps_prestablog_news.id_prestablog_news = ppnl.id_prestablog_news
    AND ppnl.id_lang = 1
WHERE ps_prestablog_news.id_prestablog_news NOT IN
      (SELECT news FROM ps_prestablog_correspondancecategorie WHERE categorie = 3);

-- Migrate category "Agenda" into event, but with loss of data, because our model is simpler
INSERT INTO event (id, name, date, type, place)
SELECT ps_prestablog_news.id_prestablog_news,
    ppnl.title,
    ps_prestablog_news.date,
    '',
    ''
FROM ps_prestablog_news
         INNER JOIN ps_prestablog_news_lang ppnl
ON ps_prestablog_news.id_prestablog_news = ppnl.id_prestablog_news
    AND ppnl.id_lang = 1
WHERE ps_prestablog_news.id_prestablog_news IN
      (SELECT news FROM ps_prestablog_correspondancecategorie WHERE categorie = 3);

INSERT INTO subscription (id, is_active, image_id, price_per_unit_chf, price_per_unit_eur, name, code, type,
                          description, internal_remarks)
VALUES (19000, 1, NULL, 5500, 4000, 'Abonnement standard papier', 'abo-papier', 'paper', 'CHANGE ME', ''),
(19001, 1, NULL, 8000, 5000, 'Abonnement standard numérique', 'abo-web', 'digital', 'CHANGE ME', ''),
(19002, 1, NULL, 10500, 7000, 'Abonnement standard papier et numérique', 'abo-web-papier', 'both', 'CHANGE ME', ''),
(19003, 1, NULL, 6500, 4500, 'Abonnement institutionnel papier', 'abo-pro-papier', 'paper', 'CHANGE ME', ''),
(19004, 1, NULL, 16000, 10000, 'Abonnement institutionnel numérique', 'abo-pro-web', 'digital', 'CHANGE ME', ''),
(19005, 1, NULL, 18500, 12000, 'Abonnement institutionnel papier et numérique', 'abo-pro-web-papier', 'both',
 'CHANGE ME', '');

-- Out of stock paper is only digital now
UPDATE product
SET type        = 'digital',
    description = REPLACE(
            REPLACE(description, '<p>La version papier est épuisée</p>', ''),
            '<p>La version papier est épuisée.  </p>', ''
        )
WHERE description LIKE '%La version papier est épuisée%';

-- Migrate one address per user, even if those data will be overwritten by cresus import after migration, it is useful for dev
UPDATE user
    INNER JOIN ps_address ON user.id = ps_address.id_customer
    INNER JOIN ps_country pc ON ps_address.id_country = pc.id_country
    INNER JOIN country ON country.code = pc.iso_code
SET user.street     = ps_address.address1,
    user.postcode   = ps_address.postcode,
    user.locality   = ps_address.city,
    user.country_id = country.id,
    user.phone      = IFNULL(IFNULL(ps_address.phone_mobile, ps_address.phone), '')
WHERE ps_address.deleted = 0
ORDER BY ps_address.date_upd;

COMMIT;
