'use strict';

describe('Controller: newBugCtrl', function() {

    var newBugCtrl, scope;
    var config, currentUser, bugId;

    // load the controller's module
    beforeEach(module('bug.controllers'));
    // load services
    beforeEach(module('bug.services'));
    beforeEach(module('user.services'));
    beforeEach(module('config.services'));
    beforeEach(module('flash.services'));
 
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        config = {
            data: {
                "users": [{
                    "username": "btuser",
                    "email": "bugtrack@marklogic.com",
                    "name": "Bugtrack User"
                }, {
                    "username": "ian",
                    "email": "ian@cerisent.com",
                    "name": "Ian Small"
                }, {
                    "username": "avnur",
                    "email": "avnur@cerisent.com",
                    "name": "Ron Avnur"
                }, {
                    "username": "cjl",
                    "email": "cjl@cerisent.com",
                    "name": "Christopher Lindblad"
                }, {
                    "username": "rwang",
                    "email": "rwang@cerisent.com",
                    "name": "Rachel Link"
                }, {
                    "username": "jim",
                    "email": "jim@cerisent.com",
                    "name": "Jim Healy"
                }, {
                    "username": "dave",
                    "email": "dave@cerisent.com",
                    "name": "Dave O'Brien"
                }, {
                    "username": "pcp",
                    "email": "pcp@cerisent.com",
                    "name": "Paul Pedersen"
                }, {
                    "username": "huifen",
                    "email": "huifen@cerisent.com",
                    "name": "Huifen Chan"
                }, {
                    "username": "jhunter",
                    "email": "jhunter@servlets.com",
                    "name": "Jason Hunter"
                }, {
                    "username": "max",
                    "email": "max@cerisent.com",
                    "name": "Max Schireson"
                }, {
                    "username": "nick",
                    "email": "nick@cerisent.com",
                    "name": "Nick Lanham"
                }, {
                    "username": "asheesh",
                    "email": "asheesh@cerisent.com",
                    "name": "Asheesh Mangla"
                }, {
                    "username": "ajay",
                    "email": "ajay@cerisent.com",
                    "name": "Ajay Singh"
                }, {
                    "username": "adam",
                    "email": "adam@cerisent.com",
                    "name": "Adam Block"
                }, {
                    "username": "mary",
                    "email": "mary@cerisent.com",
                    "name": "Mary Holstege"
                }, {
                    "username": "kelly",
                    "email": "kelly@cerisent.com",
                    "name": "Kelly Stirman"
                }, {
                    "username": "hui",
                    "email": "hui.li@marklogic.com",
                    "name": "Hui Li"
                }, {
                    "username": "denise",
                    "email": "denise.skarupski@marklogic.com",
                    "name": "Denise Miura"
                }, {
                    "username": "cwilliams",
                    "email": "cwilliams@marklogic.com",
                    "name": "Christina Williams"
                }, {
                    "username": "ronh",
                    "email": "ronh@marklogic.com",
                    "name": "Ron Hitchens"
                }, {
                    "username": "dsokolsky",
                    "email": "dsokolsky@marklogic.com",
                    "name": "Danny Sokolsky"
                }, {
                    "username": "uigwebuike",
                    "email": "uigwebuike@marklogic.com",
                    "name": "Uchenna Igwebuike"
                }, {
                    "username": "msteinberg",
                    "email": "mark.steinberg@marklogic.com",
                    "name": "Mark Steinberg"
                }, {
                    "username": "rpolasani",
                    "email": "raghu.polasani@marklogic.com",
                    "name": "Raghu Polasani"
                }, {
                    "username": "johnpilat",
                    "email": "john.pilat@marklogic.com",
                    "name": "John Pilat"
                }, {
                    "username": "jfc",
                    "email": "jfc@marklogic.com",
                    "name": "John Canny"
                }, {
                    "username": "mturner",
                    "email": "matt.turner@marklogic.com",
                    "name": "Matt Turner"
                }, {
                    "username": "nobody",
                    "email": "nobody@marklogic.com",
                    "name": "nobody nobody"
                }, {
                    "username": "jespinoza",
                    "email": "jespinoza@marklogic.com",
                    "name": "Jose Espinoza"
                }, {
                    "username": "shivaji",
                    "email": "Shivaji.Dutta@marklogic.com",
                    "name": "Shivaji Dutta"
                }, {
                    "username": "sbuxton",
                    "email": "stephen.buxton@marklogic.com",
                    "name": "Stephen Buxton"
                }, {
                    "username": "jmeree",
                    "email": "joe.meree@marklogic.com",
                    "name": "Joe Meree"
                }, {
                    "username": "cbiow",
                    "email": "chris.biow@marklogic.com",
                    "name": "Christopher Biow"
                }, {
                    "username": "dclark",
                    "email": "dan.clark@marklogic.com",
                    "name": "Dan Clark"
                }, {
                    "username": "wlaforest",
                    "email": "wlaforest@marklogic.com",
                    "name": "William LaForest"
                }, {
                    "username": "smudunuri",
                    "email": "smudunuri@marklogic.com",
                    "name": "Shashi Mudunuri"
                }, {
                    "username": "prooney",
                    "email": "paul.rooney@marklogic.com",
                    "name": "Paul Rooney"
                }, {
                    "username": "jkerr",
                    "email": "james.kerr@marklogic.com",
                    "name": "James Kerr"
                }, {
                    "username": "cwhitney",
                    "email": "colleen.whitney@marklogic.com",
                    "name": "Colleen  Whitney"
                }, {
                    "username": "jcooper",
                    "email": "jcooper@marklogic.com",
                    "name": "Justin Cooper"
                }, {
                    "username": "cwelch",
                    "email": "cwelch@marklogic.com",
                    "name": "Christopher Welch"
                }, {
                    "username": "sravotto",
                    "email": "sravotto@marklogic.com",
                    "name": "Silvano  Ravotto"
                }, {
                    "username": "rmiller",
                    "email": "rmiller@marklogic.com",
                    "name": "Ronnen  Miller"
                }, {
                    "username": "rgrimm",
                    "email": "rgrimm@marklogic.com",
                    "name": "Ryan Grimm"
                }, {
                    "username": "pkankanala",
                    "email": "pkankanala@marklogic.com",
                    "name": "Praveen Kankanala"
                }, {
                    "username": "aagrawal",
                    "email": "aagrawal@marklogic.com",
                    "name": "Andy Agrawal"
                }, {
                    "username": "jclippinger",
                    "email": "jclippinger@marklogic.com",
                    "name": "James Clippinger"
                }, {
                    "username": "sshearer",
                    "email": "sshearer@marklogic.com",
                    "name": "Seth Shearer "
                }, {
                    "username": "mhelmstetter",
                    "email": "mark.helmstetter@marklogic.com",
                    "name": "Mark Helmstetter"
                }, {
                    "username": "achaudhry",
                    "email": "achaudhry@marklogic.com",
                    "name": "Abdul Chaudhry"
                }, {
                    "username": "jshao",
                    "email": "jshao@marklogic.com",
                    "name": "Julia Shao"
                }, {
                    "username": "frubino",
                    "email": "frubino@marklogic.com",
                    "name": "Frank Rubino"
                }, {
                    "username": "aredalen",
                    "email": "aredalen@marklogic.com",
                    "name": "Aaron Redalen"
                }, {
                    "username": "fsanders",
                    "email": "fsanders@marklogic.com",
                    "name": "Frank Sanders"
                }, {
                    "username": "paven",
                    "email": "paven@marklogic.com",
                    "name": "Pete Aven"
                }, {
                    "username": "tturchioe",
                    "email": "tturchioe@marklogic.com",
                    "name": "Tom Turchioe"
                }, {
                    "username": "ppreuveneers",
                    "email": "ppreuveneers@marklogic.com",
                    "name": "Paul Preuveneers"
                }, {
                    "username": "dlam",
                    "email": "dlam@marklogic.com",
                    "name": "David  Lam"
                }, {
                    "username": "lratcliff",
                    "email": "lratcliff@marklogic.com",
                    "name": "Larry Ratcliff"
                }, {
                    "username": "wfeick",
                    "email": "wfeick@marklogic.com",
                    "name": "Wayne Feick"
                }, {
                    "username": "damusin",
                    "email": "david.amusin@marklogic.com",
                    "name": "David Amusin"
                }, {
                    "username": "ashutosh",
                    "email": "aagarwal@marklogic.com",
                    "name": "Ashutosh Agarwal"
                }, {
                    "username": "jpurohit",
                    "email": "jpurohit@marklogic.com",
                    "name": "Juhi Purohit"
                }, {
                    "username": "prawal",
                    "email": "prawal@marklogic.com",
                    "name": "Puneet Rawal"
                }, {
                    "username": "khanson",
                    "email": "khanson@marklogic.com",
                    "name": "Kevin Hanson"
                }, {
                    "username": "darias",
                    "email": "darias@marklogic.com",
                    "name": "Dan Arias"
                }, {
                    "username": "jmakeig",
                    "email": "jmakeig@marklogic.com",
                    "name": "Justin Makeig"
                }, {
                    "username": "msrinivasan",
                    "email": "mahalakshmi.srinivasan@marklogic.com",
                    "name": "Mahalakshmi Srinivasan"
                }, {
                    "username": "crichey",
                    "email": "clark.richey@marklogic.com",
                    "name": "Clark Richey"
                }, {
                    "username": "placey",
                    "email": "placey@marklogic.com",
                    "name": "Pamela Lacey"
                }, {
                    "username": "smohanty",
                    "email": "smohanty@marklogic.com",
                    "name": "Sujit Mohanty"
                }, {
                    "username": "rmonaghan",
                    "email": "rmonaghan@marklogic.com",
                    "name": "Ryan Monaghan"
                }, {
                    "username": "skrishnan",
                    "email": "skrishnan@marklogic,com",
                    "name": "Sudhir Krishnan"
                }, {
                    "username": "jli",
                    "email": "jli@marklogic.com",
                    "name": "Julia Li"
                }, {
                    "username": "fsnow",
                    "email": "fsnow@marklogic.com",
                    "name": "Frank Snow"
                }, {
                    "username": "mdubinko",
                    "email": "mdubinko@marklogic.com",
                    "name": "Micah  Dubinko"
                }, {
                    "username": "nwalsh",
                    "email": "norman.walsh@marklogic.com",
                    "name": "Norman Walsh"
                }, {
                    "username": "jbooth",
                    "email": "jbooth@marklogic.com",
                    "name": "Jason Booth"
                }, {
                    "username": "dfeldman",
                    "email": "dfeldman@marklogic.com",
                    "name": "Damon Feldman"
                }, {
                    "username": "mdoane",
                    "email": "mdoane@marklogic.com",
                    "name": "Michael Doane"
                }, {
                    "username": "blloyd",
                    "email": "blloyd@marklogic.com",
                    "name": "Barry Lloyd"
                }, {
                    "username": "bkane",
                    "email": "bkane@marklogic.com",
                    "name": "Bintou Kane"
                }, {
                    "username": "fmesa",
                    "email": "fmesa@marklogic.com",
                    "name": "Fernando  Mesa"
                }, {
                    "username": "phare",
                    "email": "phare@marklogic.com",
                    "name": "Paxton Hare"
                }, {
                    "username": "gkatz",
                    "email": "gkatz@marklogic.com",
                    "name": "Gary Katz"
                }, {
                    "username": "kpulkesin",
                    "email": "kpulkesin@marklogic.com",
                    "name": "Kumar Pulkesin"
                }, {
                    "username": "jmonberg",
                    "email": "jmonberg@marklogic.com",
                    "name": "Jason Monberg"
                }, {
                    "username": "schen",
                    "email": "schen@marklogic.com",
                    "name": "Sidney Chen"
                }, {
                    "username": "yzhan",
                    "email": "yzhan@marklogic.com",
                    "name": "Yan Zhan"
                }, {
                    "username": "msarma",
                    "email": "msarma@marklogic.com",
                    "name": "Meghalim Sarma"
                }, {
                    "username": "dsherman",
                    "email": "dsherman@marklogic.com",
                    "name": "David  Sherman"
                }, {
                    "username": "gfurbush",
                    "email": "gfurbush@marklogic.com",
                    "name": "Gordon Furbush "
                }, {
                    "username": "emiller",
                    "email": "emiller@marklogic.com",
                    "name": "Erin Miller"
                }, {
                    "username": "sparnell",
                    "email": "sparnell@marklogic.com",
                    "name": "Scott Parnell"
                }, {
                    "username": "oschwering",
                    "email": "oschwering@marklogic.com",
                    "name": "Olav  Schwering"
                }, {
                    "username": "sneth",
                    "email": "sneth@marklogic.com",
                    "name": "Sam Neth"
                }, {
                    "username": "jrunkel",
                    "email": "Jay.Runkel@marklogic.com",
                    "name": "Jay Runkel"
                }, {
                    "username": "danderson",
                    "email": "donald.anderson@marklogic.com",
                    "name": "Donald  Anderson"
                }, {
                    "username": "akakkar",
                    "email": "Ankit.Kakkar@marklogic.com",
                    "name": "Ankit Kakkar"
                }, {
                    "username": "jstock",
                    "email": "jim.stock@marklogic.com",
                    "name": "Jim Stock"
                }, {
                    "username": "fsalonga",
                    "email": "franklin.salonga@marklogic.com",
                    "name": "Frank Salonga"
                }, {
                    "username": "gchinchwadkar",
                    "email": "Gajanan.Chinchwadkar@marklogic.com",
                    "name": "Gajanan Chinchwadkar"
                }, {
                    "username": "kbadami",
                    "email": "kash.badami@marklogic.com",
                    "name": "Kash Badami"
                }, {
                    "username": "bmo",
                    "email": "brian.mo@marklogic.com",
                    "name": "Brian Mo"
                }, {
                    "username": "wunderwood",
                    "email": "wunderwood@marklogic.com",
                    "name": "Walter  Underwood"
                }, {
                    "username": "bcoryat",
                    "email": "Blossom.Coryat@marklogic.com",
                    "name": "Blossom Coryat"
                }, {
                    "username": "ayuwono",
                    "email": "ayuwono@marklogic.com",
                    "name": "Aries Yuwono"
                }, {
                    "username": "ebloch",
                    "email": "eric.bloch@marklogic.com",
                    "name": "Eric Bloch"
                }, {
                    "username": "vmadan",
                    "email": "vmadan@marklogic.com",
                    "name": "Vinay Madan"
                }, {
                    "username": "derickson",
                    "email": "David.Erickson@marklogic.com",
                    "name": "David Erickson"
                }, {
                    "username": "dcassel",
                    "email": "dave.cassel@marklogic.com",
                    "name": "Dave Cassel"
                }, {
                    "username": "jvogt",
                    "email": "jd.vogt@marklogic.com",
                    "name": "JD Vogt"
                }, {
                    "username": "jmyatt",
                    "email": "jason.myatt@marklogic.com",
                    "name": "Jason Myatt"
                }, {
                    "username": "ybertaud",
                    "email": "ybertaud@marklogic.com",
                    "name": "Yann  Bertaud"
                }, {
                    "username": "ifinlayson",
                    "email": "iain.finlayson@marklogic.com",
                    "name": "Iain Finlayson"
                }, {
                    "username": "ccoggins",
                    "email": "cody.coggins@marklogic.com",
                    "name": "Cody Coggins"
                }, {
                    "username": "kkumar",
                    "email": "kkumar@marklogic.com",
                    "name": "Kaushal Kumar"
                }, {
                    "username": "gvidal",
                    "email": "gary.vidal@marklogic.com",
                    "name": "Gary Vidal"
                }, {
                    "username": "lpica",
                    "email": "lou.pica@marklogic.com",
                    "name": "Lou Pica"
                }, {
                    "username": "skottam",
                    "email": "Sravan.Kottam@marklogic.com",
                    "name": "Sravan Kottam"
                }, {
                    "username": "ableasdale",
                    "email": "alex.bleasdale@marklogic.com",
                    "name": "Alex Bleasdale"
                }, {
                    "username": "jchen",
                    "email": "jane.chen@marklogic.com",
                    "name": "Jane Chen"
                }, {
                    "username": "sverma",
                    "email": "shiva.verma@marklogic.com",
                    "name": "Shiva Verma"
                }, {
                    "username": "edelacruz",
                    "email": "ed.delacruz@marklogic.com",
                    "name": "Ed Delacruz"
                }, {
                    "username": "mgursky",
                    "email": "michael.gursky@marklogic.com",
                    "name": "Michael Gursky"
                }, {
                    "username": "wwallach",
                    "email": "wwallach@marklogic.com",
                    "name": "Walt Wallach"
                }, {
                    "username": "jsnelson",
                    "email": "jsnelson@marklogic.com",
                    "name": "John Snelson"
                }, {
                    "username": "sbrooks",
                    "email": "Scott.Brooks@marklogic.com",
                    "name": "Scott Brooks"
                }, {
                    "username": "pfennell",
                    "email": "philip.fennell@marklogic.com",
                    "name": "Philip Fennell"
                }, {
                    "username": "jliu",
                    "email": "jliu@marklogic.com",
                    "name": "Jessie Liu"
                }, {
                    "username": "kcoleman",
                    "email": "kim.coleman@marklogic.com",
                    "name": "Kim Coleman"
                }, {
                    "username": "wkrause",
                    "email": "Wolfgang.Krause@marklogic.com",
                    "name": "Wolfgang Krause"
                }, {
                    "username": "wholmes",
                    "email": "william.holmes@marklogic.com",
                    "name": "William Holmes"
                }, {
                    "username": "rpelton",
                    "email": "rick.pelton@marklogic.com",
                    "name": "Rick Pelton"
                }, {
                    "username": "dborkar",
                    "email": "dipti.borkar@marklogic.com",
                    "name": "Dipti Borkar"
                }, {
                    "username": "hwu",
                    "email": "haitao.wu@marklogic.com",
                    "name": "Haitao Wu"
                }, {
                    "username": "hsu",
                    "email": "hsiao.su@marklogic.com",
                    "name": "Hsiao Su"
                }, {
                    "username": "pmcgowan",
                    "email": "Preston.McGowan@marklogic.com",
                    "name": "Preston McGowan"
                }, {
                    "username": "rbhatacharya",
                    "email": "rbhatacharya@marklogic.com",
                    "name": "Rajdeep Bhattacharya"
                }, {
                    "username": "wzhou",
                    "email": "wenqi.zhou@marklogic.com",
                    "name": "Wenqi Zhou"
                }, {
                    "username": "ehennum",
                    "email": "erik.hennum@marklogic.com",
                    "name": "Erik Hennum"
                }, {
                    "username": "schartrand",
                    "email": "Steffan.Chartrand@marklogic.com",
                    "name": "Steffan Chartrand"
                }, {
                    "username": "bstarbird",
                    "email": "bob.starbird@marklogic.com",
                    "name": "Bob Starbird"
                }, {
                    "username": "agonzales",
                    "email": "tony.gonzales@marklogic.com",
                    "name": "Tony Gonzales"
                }, {
                    "username": "ksaxena",
                    "email": "kapil.saxena@marklogic.com",
                    "name": "Kapil Saxena"
                }, {
                    "username": "rhu",
                    "email": "ron.hu@marklogic.com",
                    "name": "Ron Hu"
                }, {
                    "username": "rstryker",
                    "email": "ruth.stryker@marklogic.com",
                    "name": "Ruth Stryker"
                }, {
                    "username": "tdiepenbrock",
                    "email": "Thomas.Diepenbrock@marklogic.com",
                    "name": "Thomas Diepenbrock"
                }, {
                    "username": "tbeck",
                    "email": "tom.beck@marklogic.com",
                    "name": "Tom Beck"
                }, {
                    "username": "svempati",
                    "email": "sundeep.vempati@marklogic.com",
                    "name": "Sundeep Vempati"
                }, {
                    "username": "sthirumavalavan",
                    "email": "subhadra.thirumavalavan@marklogic.com",
                    "name": "Subhadra Thirumavalavan"
                }, {
                    "username": "sstafford",
                    "email": "scott.stafford@marklogic.com",
                    "name": "Scott Stafford"
                }, {
                    "username": "elenz",
                    "email": "evan.lenz@marklogic.com",
                    "name": "Evan Lenz"
                }, {
                    "username": "ali",
                    "email": "ali@marklogic.com",
                    "name": "Aries Li"
                }, {
                    "username": "atsoi",
                    "email": "arthur.tsoi@marklogic.com",
                    "name": "Arthur Tsoi"
                }, {
                    "username": "clavin",
                    "email": "colby.lavin@marklogic.com",
                    "name": "Colby Lavin"
                }, {
                    "username": "kleong",
                    "email": "kevin.leong@marklogic.com",
                    "name": "Kevin Leong"
                }, {
                    "username": "lpollington",
                    "email": "lee.pollington@marklogic.com",
                    "name": "Lee Pollington"
                }, {
                    "username": "sreddy",
                    "email": "sreddy@marklogic.com",
                    "name": "Sudhakar Reddy"
                }, {
                    "username": "bmann",
                    "email": "brad.mann@marklogic.com",
                    "name": "Brad Mann"
                }, {
                    "username": "rjovanovich",
                    "email": "richard.jovanovich@marklogic.com",
                    "name": "Richard Jovanovich"
                }, {
                    "username": "jfuller",
                    "email": "jim.fuller@marklogic.com",
                    "name": "Jim Fuller"
                }, {
                    "username": "lling",
                    "email": "ling.ling@marklogic.com",
                    "name": "Ling Ling"
                }, {
                    "username": "smiller",
                    "email": "Scott.Miller@marklogic.com",
                    "name": "Scott Miller"
                }, {
                    "username": "grusso",
                    "email": "gary.russo@marklogic.com",
                    "name": "Gary Russo"
                }, {
                    "username": "lhutt",
                    "email": "lon.hutt@marklogic.com",
                    "name": "Lon Hutt"
                }, {
                    "username": "miyer",
                    "email": "mallika.iyer@marklogic.com",
                    "name": "Mallika Iyer"
                }, {
                    "username": "jdalton",
                    "email": "joe.dalton@marklogic.com",
                    "name": "Joe Dalton"
                }, {
                    "username": "cgreer",
                    "email": "charles.greer@marklogic.com",
                    "name": "Charles Greer"
                }, {
                    "username": "mwooldri",
                    "email": "mike.wooldridge@marklogic.com",
                    "name": "Mike Wooldridge"
                }, {
                    "username": "bgupta",
                    "email": "balkrishna.gupta@marklogic.com",
                    "name": "Balkrishna Gupta"
                }, {
                    "username": "dummy",
                    "email": "dummy@marklogic.com",
                    "name": "Dummy Dummy"
                }, {
                    "username": "gghai",
                    "email": "Gaurav.ghai@marklogic.com",
                    "name": "Gaurav Ghai"
                }, {
                    "username": "achoudha",
                    "email": "ajay.choudhary@marklogic.com",
                    "name": "Ajay Choudhary"
                }, {
                    "username": "tgallowa",
                    "email": "thomas.galloway@marklogic.com",
                    "name": "Thomas Galloway"
                }, {
                    "username": "ctaylor",
                    "email": "christophe.taylor@marklogic.com",
                    "name": "Christophe Taylor"
                }, {
                    "username": "jfurt",
                    "email": "Julie.Furt@marklogic.com",
                    "name": "Julie Furt"
                }, {
                    "username": "tchen",
                    "email": "tian.chen@marklogic.com",
                    "name": "Tian Chen"
                }, {
                    "username": "pclark",
                    "email": "Pamela.Clark@marklogic.com",
                    "name": "Pamela Clark"
                }, {
                    "username": "tstyslinger",
                    "email": "tim.styslinger@marklogic.com",
                    "name": "Tim Styslinger"
                }, {
                    "username": "gvaidees",
                    "email": "Ganesh.Vaideeswaran@marklogic.com",
                    "name": "Ganesh Vaideeswaran"
                }, {
                    "username": "bciano",
                    "email": "Bill.Ciano@marklogic.com",
                    "name": "Bill Ciano"
                }, {
                    "username": "imasri",
                    "email": "Isie.Masri@marklogic.com",
                    "name": "Isie Masri"
                }, {
                    "username": "glang",
                    "email": "Gary.Lang@marklogic.com",
                    "name": "Gary Lang"
                }, {
                    "username": "mdolan",
                    "email": "Michael.Dolan@marklogic.com",
                    "name": "Michael Dolan"
                }, {
                    "username": "srandle",
                    "email": "Steve.Randle@marklogic.com",
                    "name": "Steve Randle"
                }, {
                    "username": "dchander",
                    "email": "dinesh.chander@globallogic.com",
                    "name": "Dinesh Chander"
                }, {
                    "username": "mislam",
                    "email": "Towhid.Islam@marklogic.com",
                    "name": "Towhid Islam"
                }, {
                    "username": "sbrockma",
                    "email": "Steven.Brockman@marklogic.com",
                    "name": "Steven Brockman"
                }, {
                    "username": "mlindber",
                    "email": "Magnus.Lindberg@marklogic.com",
                    "name": "Magnus Lindberg"
                }, {
                    "username": "tbrady",
                    "email": "Terry.Brady@marklogic.com",
                    "name": "Terry Brady"
                }, {
                    "username": "cwang",
                    "email": "cwang@marklogic.com",
                    "name": "Chonghai Wang"
                }, {
                    "username": "dlee",
                    "email": "David.Lee@marklogic.com",
                    "name": "David  Lee"
                }, {
                    "username": "vkorolev",
                    "email": "vitaly.korolev@marklogic.com",
                    "name": "Vitaly Korolev"
                }, {
                    "username": "sakare",
                    "email": "Sumit.Akare@marklogic.com",
                    "name": "Sumit Akare"
                }, {
                    "username": "myawitz",
                    "email": "mitchell.yawitz@marklogic.com",
                    "name": "Mitch Yawitz"
                }, {
                    "username": "jsolis",
                    "email": "Julio.Solis@marklogic.com",
                    "name": "Julio Solis"
                }, {
                    "username": "dmalkina",
                    "email": "Deena.Malkina@marklogic.com",
                    "name": "Deena Malkina"
                }, {
                    "username": "iagrawal",
                    "email": "iagrawal@marklogic.com",
                    "name": "Isha Agrawal"
                }, {
                    "username": "kmccaleb",
                    "email": "Ken.McCaleb@marklogic.com",
                    "name": "Ken McCaleb"
                }, {
                    "username": "ktune",
                    "email": "Ken.Tune@marklogic.com",
                    "name": "Ken Tune"
                }, {
                    "username": "jhoy",
                    "email": "Joe.Hoy@marklogic.com",
                    "name": "Joe Hoy"
                }, {
                    "username": "knagar",
                    "email": "Kuldeep.Nagar@marklogic.com",
                    "name": "Kuldeep Nagar"
                }, {
                    "username": "mbhatnagar",
                    "email": "mayank.bhatnagar@marklogic.com",
                    "name": "Mayank Bhatnagar"
                }, {
                    "username": "mbhatnag",
                    "email": "Mayank.Bhatnagar@marklogic.com",
                    "name": "Mayank Bhatnagar"
                }, {
                    "username": "pkim",
                    "email": "pkim@marklogic.com",
                    "name": "Peter Kim"
                }, {
                    "username": "fxue",
                    "email": "Fei.Xue@marklogic.com",
                    "name": "Fei Xue"
                }, {
                    "username": "dkim",
                    "email": "Dale.Kim@marklogic.com",
                    "name": "Dale Kim"
                }, {
                    "username": "pcaine",
                    "email": "Penny.Caine@marklogic.com",
                    "name": "Penny Caine"
                }, {
                    "username": "gnist",
                    "email": "Greg.Nist@marklogic.com",
                    "name": "Greg Nist"
                }, {
                    "username": "ewasser",
                    "email": "Eric.Wasser@marklogic.com",
                    "name": "Eric Wasser"
                }, {
                    "username": "jcrean",
                    "email": "Joe.Crean@marklogic.com",
                    "name": "Joe Crean"
                }, {
                    "username": "bwoolfol",
                    "email": "Bernard.Woolfolk@marklogic.com",
                    "name": "Bernard  Woolfolk"
                }, {
                    "username": "dgorbet",
                    "email": "David.Gorbet@marklogic.com",
                    "name": "David Gorbet"
                }, {
                    "username": "arosenba",
                    "email": "Aaron.Rosenbaum@marklogic.com",
                    "name": "Aaron Rosenbaum"
                }, {
                    "username": "aobermay",
                    "email": "Andy.Obermayer@marklogic.com",
                    "name": "Andy Obermayer"
                }, {
                    "username": "sguttman",
                    "email": "Steve.Guttman@marklogic.com",
                    "name": "Steve Guttman"
                }, {
                    "username": "dsheahan",
                    "email": "Denis.Sheahan@marklogic.com",
                    "name": "Denis Sheahan"
                }, {
                    "username": "scrook",
                    "email": "Stephen.Crook@marklogic.com",
                    "name": "Stephen Crook"
                }, {
                    "username": "sanand",
                    "email": "Sumit.Anand@marklogic.com",
                    "name": "Sumit Anand"
                }, {
                    "username": "aabbas",
                    "email": "Adeel.Abbas@marklogic.com",
                    "name": "Adeel Abbas"
                }, {
                    "username": "smazer",
                    "email": "Sara.Mazer@marklogic.com",
                    "name": "Sara  Mazer"
                }, {
                    "username": "tsmirnov",
                    "email": "Tanya.Smirnov@marklogic.com",
                    "name": "Tanya Smirnov"
                }, {
                    "username": "mwhiteha",
                    "email": "matthew.whitehart@marklogic.com",
                    "name": "Matthew Whitehart  "
                }, {
                    "username": "crothwel",
                    "email": "Chris.Rothwell@marklogic.com",
                    "name": "Chris Rothwell"
                }, {
                    "username": "tsuzuki",
                    "email": "takashi.suzuki@marklogic.com",
                    "name": "Takashi Suzuki"
                }, {
                    "username": "gpushkar",
                    "email": "gaurav.pushkarna@marklogic.com",
                    "name": "Gaurav Pushkarna"
                }, {
                    "username": "jgardner",
                    "email": "James.Gardner@marklogic.com",
                    "name": "James Gardner"
                }, {
                    "username": "adhavle",
                    "email": "adhavle@marklogic.com",
                    "name": "Amey Dhavle"
                }, {
                    "username": "sbodzin",
                    "email": "Sandy.Bodzin@marklogic.com",
                    "name": "Sandy Bodzin"
                }, {
                    "username": "ezegers",
                    "email": "Emil.Zegers@marklogic.com",
                    "name": "Emil Zegers"
                }, {
                    "username": "jpasqua",
                    "email": "Joe.Pasqua@marklogic.com",
                    "name": "Joe Pasqua"
                }, {
                    "username": "ldavalur",
                    "email": "ldavalur@marklogic.com",
                    "name": "L D"
                }, {
                    "username": "sstroud",
                    "email": "Scott.Stroud@marklogic.com",
                    "name": "Scott Stroud"
                }, {
                    "username": "ldavulur",
                    "email": "lavanya.davuluri@marklogic.com",
                    "name": "Lavanya Davuluri"
                }, {
                    "username": "spal",
                    "email": "Satyender.Pal@marklogic.com",
                    "name": "Satyender Pal"
                }, {
                    "username": "michael",
                    "email": "michael.blakeley@marklogic.com",
                    "name": "Michael Blakeley"
                }, {
                    "username": "jbakke",
                    "email": "Jonathan.Bakke@marklogic.com",
                    "name": "Jonathan Bakke"
                }, {
                    "username": "afowler",
                    "email": "afowler@marklogic.com",
                    "name": "Adam Fowler"
                }, {
                    "username": "lsquilla",
                    "email": "Luigi.Squillante@marklogic.com",
                    "name": "Luigi Squillante"
                }, {
                    "username": "jclark",
                    "email": "jim.clark@marklogic.com",
                    "name": "Jim Clark"
                }, {
                    "username": "jjames",
                    "email": "John.James@marklogic.com",
                    "name": "John James"
                }, {
                    "username": "mchiarin",
                    "email": "mchiarin@marklogic.com",
                    "name": "Marc Chiarini"
                }, {
                    "username": "mtodd",
                    "email": "Michaline.Todd@marklogic.com",
                    "name": "Michaline Todd"
                }, {
                    "username": "yding",
                    "email": "Yue.Ding@marklogic.com",
                    "name": "Yue Ding"
                }, {
                    "username": "rsemerau",
                    "email": "Ryan.Semerau@marklogic.com",
                    "name": "Ryan Semerau "
                }, {
                    "username": "rgupta",
                    "email": "Rashi.Gupta@marklogic.com",
                    "name": "Rashi Gupta"
                }, {
                    "username": "chamlin",
                    "email": "Chris.Hamlin@marklogic.com",
                    "name": "Chris Hamlin"
                }, {
                    "username": "bsokol",
                    "email": "Billy.Sokol@marklogic.com",
                    "name": "Billy Sokol"
                }, {
                    "username": "kmittal",
                    "email": "Kshitiz.Mittal@marklogic.com",
                    "name": "Kshitiz Mittal"
                }, {
                    "username": "jmckean",
                    "email": "Jane.McKean@marklogic.com",
                    "name": "Jane McKean"
                }, {
                    "username": "ssalsbur",
                    "email": "stu.salsbury@marklogic.com",
                    "name": "Stu Salsbury"
                }, {
                    "username": "jkrebs",
                    "email": "Jonathan.Krebs@marklogic.com",
                    "name": "Jonathan Krebs"
                }, {
                    "username": "rlouapre",
                    "email": "Richard.Louapre@marklogic.com",
                    "name": "Richard Louapre"
                }, {
                    "username": "mferneau",
                    "email": "Mark.Ferneau@marklogic.com",
                    "name": "Mark Ferneau"
                }, {
                    "username": "vdeodhar",
                    "email": "Vaidehi.Deodhar@marklogic.com",
                    "name": "Vaidehi Deodhar"
                }, {
                    "username": "mcrosier",
                    "email": "Matthew.Crosier@marklogic.com",
                    "name": "Matthew Crosier"
                }, {
                    "username": "pkester",
                    "email": "Peter.Kester@marklogic.com",
                    "name": "Peter Kester"
                }, {
                    "username": "cschilli",
                    "email": "Chris.Schilling@marklogic.com",
                    "name": "Chris Schilling"
                }, {
                    "username": "kalderet",
                    "email": "Kasey.Alderete@marklogic.com",
                    "name": "Kasey Alderete"
                }, {
                    "username": "jbryan",
                    "email": "Joe.Bryan@marklogic.com",
                    "name": "Joe Bryan"
                }, {
                    "username": "fpacione",
                    "email": "Frank.Pacione@marklogic.com",
                    "name": "Frank Pacione"
                }, {
                    "username": "jdriscol",
                    "email": "Jim.Driscoll@marklogic.com",
                    "name": "Jim Driscoll"
                }, {
                    "username": "gjosten",
                    "email": "Geert.Josten@marklogic.com",
                    "name": "Geert Josten"
                }, {
                    "username": "smefford",
                    "email": "Sam.Mefford@marklogic.com",
                    "name": "Sam Mefford"
                }, {
                    "username": "imekrez",
                    "email": "Idriss.Mekrez@marklogic.com",
                    "name": "Idriss Mekrez"
                }, {
                    "username": "amistry",
                    "email": "Avinash.Mistry@marklogic.com",
                    "name": "Avinash Mistry"
                }, {
                    "username": "vgoyal",
                    "email": "Vipul.Goyal@marklogic.com",
                    "name": "Vipul Goyal"
                }, {
                    "username": "ageorge",
                    "email": "ageorge@marklogic.com",
                    "name": "Ajit George"
                }, {
                    "username": "mpowers",
                    "email": "Mason.Powers@marklogic.com",
                    "name": "Mason Powers"
                }, {
                    "username": "jhuang",
                    "email": "June.Huang@marklogic.com",
                    "name": "June Huang"
                }, {
                    "username": "skumar",
                    "email": "Satyendra.Kumar@marklogic.com.",
                    "name": "Satyendra Kumar"
                }, {
                    "username": "iarora",
                    "email": "Ish.Arora@marklogic.com",
                    "name": "Ish Arora"
                }, {
                    "username": "xlei",
                    "email": "lei.xu@marklogic.com",
                    "name": "Lei Xu"
                }, {
                    "username": "TestGanesh",
                    "email": "Ganesh.Vaideeswaran@marklogic.com",
                    "name": "TestGanesh TestGanesh"
                }, {
                    "username": "rrudin",
                    "email": "Robert.Rudin@marklogic.com",
                    "name": "Robert Rudin"
                }, {
                    "username": "phoehne",
                    "email": "Paul.Hoehne@marklogic.com",
                    "name": "Paul Hoehne"
                }, {
                    "username": "mzergaou",
                    "email": "Mohamed.Zergaoui@marklogic.com",
                    "name": "Mohamed Zergaoui"
                }, {
                    "username": "mplotnic",
                    "email": "Mark.Plotnick@marklogic.com",
                    "name": "Mark Plotnick"
                }, {
                    "username": "sbertold",
                    "email": "pramod.baireddy@hp.com",
                    "name": "Steve Bertoldi"
                }, {
                    "username": "rcaltabi",
                    "email": "Rosario.Caltabiano@marklogic.com",
                    "name": "Rosario Caltabiano"
                }, {
                    "username": "jdonner",
                    "email": "Jeff.Donner@marklogic.com",
                    "name": "Jeff Donner"
                }, {
                    "username": "rdew",
                    "email": "Ryan.Dew@marklogic.com",
                    "name": "Ryan Dew"
                }, {
                    "username": "eouthwai",
                    "email": "Ed.Outhwaite@marklogic.com",
                    "name": "Ed Outhwaite"
                }, {
                    "username": "nsingh",
                    "email": "nishant.singh@marklogic.com",
                    "name": "Nishant Singh"
                }, {
                    "username": "jjoerg",
                    "email": "Jochen.Joerg@marklogic.com",
                    "name": "Jochen Joerg"
                }, {
                    "username": "bdang",
                    "email": "Balvinder.Dang@marklogic.com",
                    "name": "Balvinder Dang"
                }, {
                    "username": "mthahir",
                    "email": "Mohamad.Thahir@marklogic.com",
                    "name": "Mohamad Thahir"
                }, {
                    "username": "cmilani",
                    "email": "Caio.Milani@marklogic.com",
                    "name": "Caio Milani"
                }, {
                    "username": "marmagos",
                    "email": "Mike.Armagost@marklogic.com",
                    "name": "Mike Armagost"
                }, {
                    "username": "cchaplin",
                    "email": "Chris.Chaplinsky@marklogic.com",
                    "name": "Chris Chaplinsky"
                }, {
                    "username": "credding",
                    "email": "Clay.Redding@marklogic.com",
                    "name": "Clay Redding"
                }, {
                    "username": "rpughsle",
                    "email": "Rob.Pughsley@marklogic.com",
                    "name": "Rob Pughsley "
                }, {
                    "username": "mderu",
                    "email": "Michel.deRu@marklogic.com",
                    "name": "Michel deRu"
                }, {
                    "username": "tpiros",
                    "email": "Tamas.Piros@marklogic.com",
                    "name": "Tamas Piros"
                }, {
                    "username": "jwilliam",
                    "email": "Jon.Williams@marklogic.com",
                    "name": "Jon Williams"
                }, {
                    "username": "kford",
                    "email": "kevin.ford@marklogic.com",
                    "name": "Kevin Ford"
                }, {
                    "username": "psingla",
                    "email": "pooja.singla@marklogic.com",
                    "name": "Pooja  Singla"
                }, {
                    "username": "hmediche",
                    "email": "harsha.medicherla@marklogic.com",
                    "name": "Harsha Medicherla"
                }, {
                    "username": "amund",
                    "email": "alexander.mund@marklogic.com",
                    "name": "Alexander Mund"
                }, {
                    "username": "vdufault",
                    "email": "vertume.dufault@marklogic.com",
                    "name": "Vertume DuFault"
                }, {
                    "username": "jmyers",
                    "email": "jeff.myers@marklogic.com",
                    "name": "Jeff Myers"
                }, {
                    "username": "viyengar",
                    "email": "venu.iyengar@marklogic.com",
                    "name": "Venugopal Iyengar"
                }, {
                    "username": "bmiller",
                    "email": "bill.miller@marklogic.com",
                    "name": "William Miller"
                }, {
                    "username": "mmaachou",
                    "email": "mehdi.maachou@marklogic.com",
                    "name": "Mehdi Maachou"
                }, {
                    "username": "mrodrigu",
                    "email": "Miguel.Rodriguez@marklogic.com",
                    "name": "Miguel Rodriguez"
                }, {
                    "username": "charagan",
                    "email": "christy.haragan@marklogic.com",
                    "name": "Christy Haragan"
                }, {
                    "username": "dsoares",
                    "email": "donald.soares@marklogic.com",
                    "name": "Donald Soares"
                }, {
                    "username": "fgeorges",
                    "email": "Florent.Georges@marklogic.com",
                    "name": "Florent Georges"
                }, {
                    "username": "dmaddox",
                    "email": "Daphne.Maddox@marklogic.com",
                    "name": "Daphne Maddox"
                }, {
                    "username": "kkrupa",
                    "email": "Ken.Krupa@marklogic.com",
                    "name": "Ken Krupa"
                }, {
                    "username": "mlawson",
                    "email": "mark.lawson@marklogic.com",
                    "name": "Mark Lawson"
                }, {
                    "username": "cmontero",
                    "email": "carlos.montero@marklogic.com",
                    "name": "Carlos Montero"
                }, {
                    "username": "cstillio",
                    "email": "cameron.stillion@marklogic.com",
                    "name": "Cameron  Stillion"
                }],
                "groups": [{
                    "label": "dev",
                    "value": "dev",
                    "children": [{
                        "label": "Ian Small",
                        "value": {
                            "username": "ian",
                            "email": "ian@cerisent.com",
                            "name": "Ian Small"
                        },
                        "parent": "dev"
                    }, {
                        "label": "Paul Pedersen",
                        "value": {
                            "username": "pcp",
                            "email": "pcp@cerisent.com",
                            "name": "Paul Pedersen"
                        },
                        "parent": "dev"
                    }]
                }, {
                    "label": "qa",
                    "value": "qa",
                    "children": [{
                        "label": "Bugtrack User",
                        "value": {
                            "username": "btuser",
                            "email": "bugtrack@marklogic.com",
                            "name": "Bugtrack User"
                        },
                        "parent": "qa"
                    }, {
                        "label": "Jason Hunter",
                        "value": {
                            "username": "jhunter",
                            "email": "jhunter@servlets.com",
                            "name": "Jason Hunter"
                        },
                        "parent": "qa"
                    }, {
                        "label": "Nick Lanham",
                        "value": {
                            "username": "nick",
                            "email": "nick@cerisent.com",
                            "name": "Nick Lanham"
                        },
                        "parent": "qa"
                    }, {
                        "label": "group1",
                        "value": "group1",
                        "children": [{
                            "label": "Jason Hunter",
                            "value": {
                                "username": "jhunter",
                                "email": "jhunter@servlets.com",
                                "name": "Jason Hunter"
                            },
                            "parent": "group1"
                        }, {
                            "label": "Mary Holstege",
                            "value": {
                                "username": "mary",
                                "email": "mary@cerisent.com",
                                "name": "Mary Holstege"
                            },
                            "parent": "group1"
                        }, {
                            "label": "group2",
                            "value": "group2",
                            "children": [{
                                "label": "Denise Miura",
                                "value": {
                                    "username": "denise",
                                    "email": "denise.skarupski@marklogic.com",
                                    "name": "Denise Miura"
                                },
                                "parent": "group2"
                            }, {
                                "label": "Danny Sokolsky",
                                "value": {
                                    "username": "dsokolsky",
                                    "email": "dsokolsky@marklogic.com",
                                    "name": "Danny Sokolsky"
                                },
                                "parent": "group2"
                            }, {
                                "label": "group3",
                                "value": "group3",
                                "children": [{
                                    "label": "Kelly Stirman",
                                    "value": {
                                        "username": "kelly",
                                        "email": "kelly@cerisent.com",
                                        "name": "Kelly Stirman"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Hui Li",
                                    "value": {
                                        "username": "hui",
                                        "email": "hui.li@marklogic.com",
                                        "name": "Hui Li"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Denise Miura",
                                    "value": {
                                        "username": "denise",
                                        "email": "denise.skarupski@marklogic.com",
                                        "name": "Denise Miura"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Christina Williams",
                                    "value": {
                                        "username": "cwilliams",
                                        "email": "cwilliams@marklogic.com",
                                        "name": "Christina Williams"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Ron Hitchens",
                                    "value": {
                                        "username": "ronh",
                                        "email": "ronh@marklogic.com",
                                        "name": "Ron Hitchens"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Danny Sokolsky",
                                    "value": {
                                        "username": "dsokolsky",
                                        "email": "dsokolsky@marklogic.com",
                                        "name": "Danny Sokolsky"
                                    },
                                    "parent": "group3"
                                }, {
                                    "label": "Uchenna Igwebuike",
                                    "value": {
                                        "username": "uigwebuike",
                                        "email": "uigwebuike@marklogic.com",
                                        "name": "Uchenna Igwebuike"
                                    },
                                    "parent": "group3"
                                }],
                                "parent": "group2"
                            }],
                            "parent": "group1"
                        }],
                        "parent": "qa"
                    }]
                }, {
                    "label": "group1",
                    "value": "group1",
                    "children": [{
                        "label": "Jason Hunter",
                        "value": {
                            "username": "jhunter",
                            "email": "jhunter@servlets.com",
                            "name": "Jason Hunter"
                        },
                        "parent": "group1"
                    }, {
                        "label": "Mary Holstege",
                        "value": {
                            "username": "mary",
                            "email": "mary@cerisent.com",
                            "name": "Mary Holstege"
                        },
                        "parent": "group1"
                    }, {
                        "label": "group2",
                        "value": "group2",
                        "children": [{
                            "label": "Denise Miura",
                            "value": {
                                "username": "denise",
                                "email": "denise.skarupski@marklogic.com",
                                "name": "Denise Miura"
                            },
                            "parent": "group2"
                        }, {
                            "label": "Danny Sokolsky",
                            "value": {
                                "username": "dsokolsky",
                                "email": "dsokolsky@marklogic.com",
                                "name": "Danny Sokolsky"
                            },
                            "parent": "group2"
                        }, {
                            "label": "group3",
                            "value": "group3",
                            "children": [{
                                "label": "Kelly Stirman",
                                "value": {
                                    "username": "kelly",
                                    "email": "kelly@cerisent.com",
                                    "name": "Kelly Stirman"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Hui Li",
                                "value": {
                                    "username": "hui",
                                    "email": "hui.li@marklogic.com",
                                    "name": "Hui Li"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Denise Miura",
                                "value": {
                                    "username": "denise",
                                    "email": "denise.skarupski@marklogic.com",
                                    "name": "Denise Miura"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Christina Williams",
                                "value": {
                                    "username": "cwilliams",
                                    "email": "cwilliams@marklogic.com",
                                    "name": "Christina Williams"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Ron Hitchens",
                                "value": {
                                    "username": "ronh",
                                    "email": "ronh@marklogic.com",
                                    "name": "Ron Hitchens"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Danny Sokolsky",
                                "value": {
                                    "username": "dsokolsky",
                                    "email": "dsokolsky@marklogic.com",
                                    "name": "Danny Sokolsky"
                                },
                                "parent": "group3"
                            }, {
                                "label": "Uchenna Igwebuike",
                                "value": {
                                    "username": "uigwebuike",
                                    "email": "uigwebuike@marklogic.com",
                                    "name": "Uchenna Igwebuike"
                                },
                                "parent": "group3"
                            }],
                            "parent": "group2"
                        }],
                        "parent": "group1"
                    }]
                }, {
                    "label": "group2",
                    "value": "group2",
                    "children": [{
                        "label": "Denise Miura",
                        "value": {
                            "username": "denise",
                            "email": "denise.skarupski@marklogic.com",
                            "name": "Denise Miura"
                        },
                        "parent": "group2"
                    }, {
                        "label": "Danny Sokolsky",
                        "value": {
                            "username": "dsokolsky",
                            "email": "dsokolsky@marklogic.com",
                            "name": "Danny Sokolsky"
                        },
                        "parent": "group2"
                    }, {
                        "label": "group3",
                        "value": "group3",
                        "children": [{
                            "label": "Kelly Stirman",
                            "value": {
                                "username": "kelly",
                                "email": "kelly@cerisent.com",
                                "name": "Kelly Stirman"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Hui Li",
                            "value": {
                                "username": "hui",
                                "email": "hui.li@marklogic.com",
                                "name": "Hui Li"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Denise Miura",
                            "value": {
                                "username": "denise",
                                "email": "denise.skarupski@marklogic.com",
                                "name": "Denise Miura"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Christina Williams",
                            "value": {
                                "username": "cwilliams",
                                "email": "cwilliams@marklogic.com",
                                "name": "Christina Williams"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Ron Hitchens",
                            "value": {
                                "username": "ronh",
                                "email": "ronh@marklogic.com",
                                "name": "Ron Hitchens"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Danny Sokolsky",
                            "value": {
                                "username": "dsokolsky",
                                "email": "dsokolsky@marklogic.com",
                                "name": "Danny Sokolsky"
                            },
                            "parent": "group3"
                        }, {
                            "label": "Uchenna Igwebuike",
                            "value": {
                                "username": "uigwebuike",
                                "email": "uigwebuike@marklogic.com",
                                "name": "Uchenna Igwebuike"
                            },
                            "parent": "group3"
                        }],
                        "parent": "group2"
                    }]
                }, {
                    "label": "group3",
                    "value": "group3",
                    "children": [{
                        "label": "Kelly Stirman",
                        "value": {
                            "username": "kelly",
                            "email": "kelly@cerisent.com",
                            "name": "Kelly Stirman"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Hui Li",
                        "value": {
                            "username": "hui",
                            "email": "hui.li@marklogic.com",
                            "name": "Hui Li"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Denise Miura",
                        "value": {
                            "username": "denise",
                            "email": "denise.skarupski@marklogic.com",
                            "name": "Denise Miura"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Christina Williams",
                        "value": {
                            "username": "cwilliams",
                            "email": "cwilliams@marklogic.com",
                            "name": "Christina Williams"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Ron Hitchens",
                        "value": {
                            "username": "ronh",
                            "email": "ronh@marklogic.com",
                            "name": "Ron Hitchens"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Danny Sokolsky",
                        "value": {
                            "username": "dsokolsky",
                            "email": "dsokolsky@marklogic.com",
                            "name": "Danny Sokolsky"
                        },
                        "parent": "group3"
                    }, {
                        "label": "Uchenna Igwebuike",
                        "value": {
                            "username": "uigwebuike",
                            "email": "uigwebuike@marklogic.com",
                            "name": "Uchenna Igwebuike"
                        },
                        "parent": "group3"
                    }]
                }],
                "groupCriteria": [{
                    "label": "Assigned to",
                    "value": "assignTo"
                }, {
                    "label": "Submitted by",
                    "value": "submittedBy"
                }],
                "severity": [
                    "P1 - Catastrophic",
                    "P2 - Critical",
                    "P3 - Major",
                    "P4 - Minor",
                    "P5 - Aesthetic",
                    "Performance"
                ],
                "status": [
                    "New",
                    "Verify",
                    "Test",
                    "Fix",
                    "Ship",
                    "Closed",
                    "Will not fix",
                    "External"
                ],
                "version": [
                    "5.0-1",
                    "5.0-2",
                    "5.0-3",
                    "5.0-3.1",
                    "5.0-3.2",
                    "5.0-3.2.1",
                    "5.0-3.3",
                    "5.0-4",
                    "5.0-4.1",
                    "5.0-4.2",
                    "5.0-4.3",
                    "5.0-4.4",
                    "5.0-5",
                    "5.0-5.1",
                    "5.0-5.2",
                    "5.0-5.3",
                    "5.0-5.4",
                    "5.0-5.5",
                    "5.0-5.6",
                    "5.0-6",
                    "5.0-6.1",
                    "5.0-nightly",
                    "5.0.4-5",
                    "6.0-1",
                    "6.0-1.2",
                    "6.0-2",
                    "6.0-2.1",
                    "6.0-2.2",
                    "6.0-2.3",
                    "6.0-3",
                    "6.0-3.1",
                    "6.0-3.2",
                    "6.0-3.3",
                    "6.0-4",
                    "6.0-4.1",
                    "6.0-4.2",
                    "6.0-4.3",
                    "6.0-4.4",
                    "6.0-4.5",
                    "6.0-5",
                    "6.0-5.1",
                    "6.0-5.2",
                    "6.0-5.3",
                    "6.0-nightly",
                    "7.0-1",
                    "7.0-2",
                    "7.0-2.1",
                    "7.0-2.2",
                    "7.0-2.3",
                    "7.0-2.4",
                    "7.0-3",
                    "7.0-nightly",
                    "8.0-ea1",
                    "8.0-nightly",
                    "Admin-License-0.1",
                    "Bugtrack-1.1",
                    "Bugtrack-2.0",
                    "DMC-0.2",
                    "DTE-1.0-1",
                    "DTE-1.0-nightly",
                    "EATool-2.1",
                    "Gen-1.0-eb5",
                    "Help-1.0",
                    "MSOA-1.0-1",
                    "MSOA-1.0-nightly",
                    "Mint-1.0",
                    "RFETrack 2.0-1",
                    "SPC-1.0-3",
                    "SPC-1.0-nightly",
                    "SPC-1.1-1",
                    "TKE-1.0-nightly",
                    "TKE-2.0-1",
                    "TKP-1.0-nightly",
                    "TKP-2.0-1",
                    "TKW-1.0-nightly",
                    "TKW-2.0-1",
                    "n/a"
                ],
                "kind": [
                    "Bug",
                    "Other",
                    "RFE",
                    "Task"
                ],
                "platform": [
                    "all",
                    "linux(32-bit)",
                    "linux(64-bit)",
                    "windows(64-bit)",
                    "windows(32-bit)",
                    "solaris(sparc)",
                    "solaris(opteron)",
                    "vmware",
                    "OS X",
                    "EC2"
                ],
                "tofixin": [
                    "5.0-6.2",
                    "5.0-6.3",
                    "5.0-7",
                    "6.0-6",
                    "7.0-4",
                    "8.0-1",
                    "8.0-2",
                    "8.0-ea2",
                    "8.0-ea3",
                    "Admin-License-0.2",
                    "Bugtrack-2.1",
                    "DMC-0.3",
                    "Help-1.1",
                    "Mint-2.0",
                    "RFETrack-2.1"
                ],
                "category": [
                    "Admin API",
                    "Admin License",
                    "App Builder",
                    "Backup/Restore",
                    "Basis",
                    "Bi-Temporal",
                    "Bugtrack",
                    "Common API",
                    "Config Management",
                    "Conformance",
                    "DMC",
                    "Debug API",
                    "Entry Page",
                    "Example App",
                    "HP-OM-SPI",
                    "Hadoop Connector",
                    "Help (Kayako)",
                    "InfoStudio API",
                    "InfoStudio UI",
                    "JSON",
                    "JavaScript",
                    "Kick It",
                    "MLOS",
                    "MarkLogic Java API",
                    "MarkLogic Node API",
                    "MarkLogic REST API",
                    "Mint",
                    "Monitoring Dashboard",
                    "Nagios",
                    "Node.js",
                    "OutsideIn",
                    "Oxygen",
                    "Query Console",
                    "RFETrack",
                    "Read-Only Config",
                    "ReferenceArchitecture",
                    "Replication",
                    "SQL",
                    "SQL UI",
                    "Samplestack",
                    "Scheduled Tasks",
                    "Search API",
                    "Semantics",
                    "Serialization",
                    "SharePoint Connector",
                    "Spelling Suggestion",
                    "TK Excel",
                    "TK PPT",
                    "TK Word",
                    "Test infrastructure",
                    "Tiered Storage",
                    "Upgrade",
                    "Usage/Perf Metrics",
                    "Utility Computing",
                    "Validation",
                    "VizLogic-Widgets",
                    "Wiki",
                    "XCC/.Net",
                    "XCC/Java",
                    "XDBC(.Net)",
                    "XDBC(Java)",
                    "XQuery",
                    "XSLT",
                    "adminGUI",
                    "antennahouse",
                    "conversion",
                    "documentation",
                    "iceni",
                    "inxight",
                    "markspace",
                    "mlcp",
                    "packaging",
                    "samples",
                    "search",
                    "security",
                    "xdmp"
                ],
                "priority": [{
                    "level": "1",
                    "title": "Drop everything and fix"
                }, {
                    "level": "2",
                    "title": "A customer is waiting for this"
                }, {
                    "level": "3",
                    "title": "Very important"
                }, {
                    "level": "4",
                    "title": "Important"
                }, {
                    "level": "5",
                    "title": "Fix if time permits"
                }, {
                    "level": "6",
                    "title": "Probably won’t fix but worth remembering"
                }, {
                    "level": "7",
                    "title": "Do not fix"
                }],
                "publishStatus": [
                    "Not Ready",
                    "Never Publish",
                    "Prepare",
                    "Publish"
                ],
                "customerImpact": [{
                    "level": "High",
                    "title": "Significant business impact with no reasonable workaround"
                }, {
                    "level": "Medium",
                    "title": "Requires significant or unnatural effort to work around issue or to prevent significant business impact"
                }, {
                    "level": "Low",
                    "title": "Minimal business impact or reasonable workaround is available"
                }, {
                    "level": "N/A",
                    "title": null
                }]
            }
        }
        bugId = {
            data: {
                count: 1
            }
        };
        currentUser = {
            name: 'admin',
            username: 'admin',
            email: 'admin@email.com'
        };
        scope = $rootScope.$new();
        scope.assignTo = {
            "username": "sreddy",
            "email": "sreddy@marklogic.com",
            "name": "Sudhakar Reddy"
        }



        newBugCtrl = $controller('newBugCtrl', {
            $scope: scope,
            config: config,
            currentUser: currentUser,
            bugId: bugId
        });
    }));

    it('should ...', function() {
        expect(bugId.data.count).toEqual(1);
    });

    it('it should create a new bug', function() {
        // scope.$broadcast('fileSelected');
        newBugCtrl.submitBug();
    });
});