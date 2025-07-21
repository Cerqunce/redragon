use("redragon");

// db.getCollection("reviews").find()

db.getCollection("reviews").updateOne(
  { _id: ObjectId("687ea031176c4e22295e29e4") },
  {
    $set: {
      content:
        '<p>test2</p><figure class=\"image\"><img src=\"https://redragon-production.up.railway.app/api/uploads/1753128983770download.jpg\"></figure>',
    },
  }
);
