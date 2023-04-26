import argostranslate.package as package
import argostranslate.translate as translate
from argostranslate.translate import Language
from translate.utils.constants import UPDATE_MODELS
from typing import List


class Translate:

    languages: List[Language]

    def __init__(self):

        self.install_models()

    def install_models(self):
        package.update_package_index()
        available_packages = package.get_available_packages()

        installed_packages = package.get_installed_packages()

        for available_package in available_packages:
            index = -1
            try:
                index = installed_packages.index(available_package)
            except:
                print("Package %s, not found" % (available_package))
            if index == -1 or UPDATE_MODELS:
                print(
                    "Downloading %s: version %s ..."
                    % (available_package, available_package.package_version)
                )
                available_package.install()  # type: ignore

        self.languages = translate.get_installed_languages()

    def translate(self, text: str, from_code: str, to_code: str):
        return translate.translate(text, from_code, to_code)

    def get_languages(self):
        return self.languages
