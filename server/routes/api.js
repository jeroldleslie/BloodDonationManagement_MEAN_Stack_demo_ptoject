var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('bloodbank', ['donors'])

//Post donor
router.post('/donor', function (req, res, next) {
    let donor = req.body;
    if (!donor) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.donors.save(donor, function (err, donor) {
            if (err) {
                res.send(err);
            }
            res.json(donor);
        });
    }
});

//Get all donors
router.get('/donor/:id', function (req, res, next) {
    let id = req.param('id');
    db.donors.findOne({
        _id: mongojs.ObjectId(id)
    }, function (err, donor) {
        if (err) {
            res.send(err);
        }
        res.json(donor);
    });
});

//Filter donor by location
router.post('/donors', function (req, res, next) {
    let query = req.body;
    db.donors.find(query, function (err, donors) {
        if (err) {
            res.send(err);
        }
        res.json(donors);
    });
});


//Get donors
router.get('/donors', function (req, res, next) {
    db.donors.find(function (err, donors) {
        if (err) {
            res.send(err);
        }
        res.json(donors);
    });
});


//Udate donor
router.put('/donor/:id', function (req, res, next) {
    let donor = req.body;
    let uptDonor = {};
    uptDonor.address = {};
    uptDonor.location = {};
    uptDonor.location.coordinates = [];

    if (donor.fname) {
        uptDonor.fname = donor.fname;
    }
    if (donor.lname) {
        uptDonor.lname = donor.lname;
    }
    if (donor.contactNum) {
        uptDonor.contactNum = donor.contactNum;
    }
    if (donor.email) {
        uptDonor.email = donor.email;
    }
    if (donor.address.addr) {
        uptDonor.address.addr = donor.address.addr;
    }
    if (donor.address.city) {
        uptDonor.address.city = donor.address.city;
    }
    if (donor.address.state) {
        uptDonor.address.state = donor.address.state;
    }
    if (donor.address.country) {
        uptDonor.address.country = donor.address.country;
    }
    if (donor.address.pcode) {
        uptDonor.address.pcode = donor.address.pcode;
    }

    if (donor.bloodGroup) {
        uptDonor.bloodGroup = donor.bloodGroup;
    }

    if (donor.location.type) {
        uptDonor.location.type = donor.location.type;
    }
    if (donor.location.coordinates[0]) {
        uptDonor.location.coordinates[0] = donor.location.coordinates[0];
    }
    if (donor.location.coordinates[1]) {
        uptDonor.location.coordinates[1] = donor.location.coordinates[1];
    }

    if (!uptDonor) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.donors.update({ _id: mongojs.ObjectId(req.params.id) }, uptDonor, {}, function (err, donor) {
            if (err) {
                res.send(err);
            }
            res.json(donor);
        });
    }

});


//Delete Donor
router.delete('/donor/:id', function (req, res, next) {
    db.donors.remove({ _id: mongojs.ObjectId(req.params.id) }, function (err, donor) {
        if (err) {
            res.send(err);
        }
        res.json(donor);
    });
});



module.exports = router;

