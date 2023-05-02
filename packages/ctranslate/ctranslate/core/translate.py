import ctranslate2
import argostranslate.package as package
import argostranslate.translate
from argostranslate.translate import Language, Package
from ctranslate.utils.constants import UPDATE_MODELS
import ctranslate.utils.lib as lib
from typing import List
from pathlib import Path


class CTranslator:
    def translate_batch(
            self, tokenized,
            num_hypotheses: int,
            max_batch_size: int,
            beam_size: int,
            length_penalty: float,
            return_scores: bool,
            replace_unknowns: bool):
        return self.translate_batch(
            tokenized,
            num_hypotheses,
            max_batch_size,
            beam_size,
            length_penalty,
            return_scores,
            replace_unknowns,
        )


class Translator:
    translator_key: str

    translator: CTranslator

    def __init__(self, translator_key: str, translator: CTranslator) -> None:
        self.translator_key = translator_key
        self.translator = translator


class Translate:

    underline = '▁'

    languages: List[Language]

    installed_packages: List[Package]

    translators: List[Translator] = []

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

        self.languages = argostranslate.translate.get_installed_languages()

        self.installed_packages = package.get_installed_packages()

        # self.set_translators()

    def translate(self, text: str, from_code: str, to_code: str):
        result = 'No translate'
        package_path = self.get_package_path(
            from_code=from_code, to_code=to_code)
        if package_path is None:
            print("Package path is: %s" % (package_path))
            return result
        translator = ctranslate2.Translator(
            f"{package_path}/model", device="cpu")
        translate_result = translator.translate_batch(
            self.tokenize(text),
            num_hypotheses=1,
            max_batch_size=32,
            beam_size=1,
            length_penalty=0.2,
            return_scores=True,
            replace_unknowns=True,)
        for v in translate_result:
            result = ''.join(v[0]['tokens']).replace(
                self.underline, ' ').strip()
        return result

    def get_translator(self, from_code: str, to_code: str):
        translator: CTranslator | None = None
        for tr in self.translators:
            translator_key = lib.get_translator_key(
                from_code=from_code, to_code=to_code)
            if tr.translator_key == translator_key:
                translator = tr.translator
        return translator

    def tokenize(self, text: str):
        result = []
        words = text.split(' ')
        for word in words:
            result.append(f"{self.underline}{word}")
        return [result]

    def get_package_path(self, from_code: str, to_code: str):
        package_path: Path | None = None
        for pack in self.installed_packages:
            if pack.from_code == from_code and pack.to_code == to_code:
                package_path = pack.package_path
        return package_path

    def set_translators(self):
        for pack in self.installed_packages:

            translator_key = lib.get_translator_key(
                from_code=pack.from_code, to_code=pack.to_code)

            translator = ctranslate2.Translator(
                str(pack.package_path / "model"), device="cpu"
            )

            translator_item = Translator(
                translator_key=translator_key, translator=translator)
            # self.translators.append(translator_item)

            print("Creating translator %s" % (translator_key))

    def get_languages(self):
        return self.languages
