import ctranslate2
import argostranslate.package as package
import argostranslate.translate
from argostranslate.translate import Language, Package
from typing import List
from pathlib import Path
import re
from utils.constants import UPDATE_MODELS, NO_TRANSLATE_MESSAGE, logger


class Translate:

    underline = '▁'

    languages: List[Language]

    installed_packages: List[Package]

    def __init__(self, install_models=False):
        if install_models:
            self.install_models()

        self.languages = argostranslate.translate.get_installed_languages()
        self.installed_packages = package.get_installed_packages()

    def install_models(self):
        package.update_package_index()
        available_packages = package.get_available_packages()

        installed_packages = package.get_installed_packages()

        for available_package in available_packages:
            index = -1
            try:
                index = installed_packages.index(available_package)
            except:
                logger.warn("Package %s, not found" % (available_package))
            if index == -1 or UPDATE_MODELS:
                logger.warn(
                    "Downloading %s: version %s ..."
                    % (available_package, available_package.package_version)
                )
                available_package.install()  # type: ignore

    def translate(self, text: str, from_code: str, to_code: str):
        result = ''
        package_path = self.get_package_path(
            from_code=from_code, to_code=to_code)
        if package_path is None:
            logger.warn("Package path is: %s" % (package_path))
            return NO_TRANSLATE_MESSAGE
        translator = ctranslate2.Translator(
            f"{package_path}/model", device="cpu")
        paragraphs = self.tokenize(text)
        for paragraph in paragraphs:
            translate_result = translator.translate_batch(
                [paragraph],
                num_hypotheses=1,
                max_batch_size=32,
                beam_size=1,
                length_penalty=0.2,
                return_scores=True,
                replace_unknowns=True,)
            _paragraph = ''
            for v in translate_result:
                _paragraph = ''.join(v[0]['tokens']).replace(
                    self.underline, ' ').strip()
            result += f"{_paragraph}\n"

        return result

    def tokenize(self, text: str):
        result = []
        paragraphs = text.split('\n')
        for paragraph in paragraphs:
            _para = paragraph.replace(',', ' , ').replace('.', ' . ').replace(
                '!', ' ! ').replace('?', ' ? ').replace(':', ' : ')
            words = filter(lambda x: x != '', _para.split(' '))
            _paragraph = []
            for word in words:
                underline = ''
                _word: str | None = word
                if re.match(r'^\w+$', word) != None:
                    underline = self.underline
                elif re.match(r"^\w+'\w+$", word) != None:
                    _word = None
                    spl_word = word.split("'")
                    _paragraph.append(f"{self.underline}{spl_word[0]}")
                    _paragraph.append("'")
                    _paragraph.append(spl_word[1])
                if _word != None:
                    _paragraph.append(f"{underline}{_word}")
            result.append(_paragraph)
        return result

    def get_package_path(self, from_code: str, to_code: str):
        package_path: Path | None = None
        for pack in self.installed_packages:
            if pack.from_code == from_code and pack.to_code == to_code:
                package_path = pack.package_path
        return package_path

    def get_languages(self):
        return self.languages
