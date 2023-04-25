import argparse
from argparse import Namespace

class Args:
    update: bool
    args: Namespace
    def __init__(self):
        self.update = False

        parser = argparse.ArgumentParser(
            description="Translate server"
        )
        parser.add_argument(
            "--update", help="Update models", action='store', nargs='*'
        )
        self.args = parser.parse_args()
        self.parse_args()

    def parse_args(self) :
        if self.args.update is not None:
            self.update = True