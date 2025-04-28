const express = require('express');
const router = express.Router();
const User = require('../models/userSchema'); // adjust path if needed

router.get('/signup-stats', async (req, res) => {
    try {
      const signupStats = await User.aggregate([
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              role: "$role"
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.date",
            roles: {
              $push: {
                role: "$_id.role",
                count: "$count"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            admin: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$roles",
                      as: "r",
                      cond: { $eq: ["$$r.role", "admin"] }
                    }
                  },
                  as: "adminRole",
                  in: "$$adminRole.count"
                }
              }
            },
            user: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$roles",
                      as: "r",
                      cond: { $eq: ["$$r.role", "user"] }
                    }
                  },
                  as: "userRole",
                  in: "$$userRole.count"
                }
              }
            },
            recruiter: {
              $sum: {
                $map: {
                  input: {
                    $filter: {
                      input: "$roles",
                      as: "r",
                      cond: { $eq: ["$$r.role", "recruiter"] }
                    }
                  },
                  as: "recruiterRole",
                  in: "$$recruiterRole.count"
                }
              }
            }
          }
        },
        {
          $sort: { date: 1 }
        }
      ]);
  
      res.json(signupStats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
