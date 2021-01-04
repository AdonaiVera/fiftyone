"""
FiftyOne v0.7.1 revision

| Copyright 2017-2020, Voxel51, Inc.
| `voxel51.com <https://voxel51.com/>`_
|
"""


def up(db):
    db.admin.command({"getParameter": 1, "featureCompatibilityVersion": 1})
    db.admin.command({"setFeatureCompatibilityVersion": "4.4"})
    db.admin.command({"getParameter": 1, "featureCompatibilityVersion": 1})


def down(db):
    db.admin.command({"getParameter": 1, "featureCompatibilityVersion": 1})
    db.admin.command({"setFeatureCompatibilityVersion": "3.6"})
    db.admin.command({"getParameter": 1, "featureCompatibilityVersion": 1})
