import ctranslate2
import argostranslate.package as package
import argostranslate.translate
from argostranslate.translate import Language, Package
from typing import List
from pathlib import Path
import sentencepiece as sp
import re
from utils.constants import NUM_HYPOTHESES, logger


class Translate:

    sentence_sym_reg = r'[!.?]'

    eol = '\n'

    underline = "▁"

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

            need_update = False
            if index != -1:
                need_update = installed_packages[index].package_version != available_package.package_version
            if index == -1 or need_update:
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
            en_translate = self.translate(
                text=text, from_code=from_code, to_code='en')
            return self.translate(text=en_translate, from_code='en', to_code=to_code)
        translator = ctranslate2.Translator(
            f"{package_path}/model", device="cpu")
        paragraphs = text.split(self.eol)
        for paragraph in paragraphs:
            tokenized = self.tokenize(package_path, paragraph)
            translate_result = translator.translate_batch(
                tokenized,
                num_hypotheses=NUM_HYPOTHESES,
                max_batch_size=32,
                beam_size=4,
                length_penalty=0.2,
                return_scores=True,
                replace_unknowns=True,)
            _paragraph = ''
            for v in translate_result:
                logger.info(v)
                _paragraph += ''.join(v[0]['tokens'])
            result += f"{_paragraph}"
        return result.replace(self.underline, " ").strip()

    def get_sentences(self, text: str):
        matches = re.findall(self.sentence_sym_reg, text)
        if matches is None:
            return [text]
        sentences = list(
            filter(lambda x: x != '', re.split(self.sentence_sym_reg, text)))
        logger.info(matches)
        for i in range(0, len(matches)):
            sentences[i] += matches[i]
        return sentences

    def tokenize(self, package_path: Path, text: str):
        sentences = self.get_sentences(text=text)
        sp_model_path = str(package_path / "sentencepiece.model")
        sp_processor = sp.SentencePieceProcessor(
            model_file=sp_model_path)  # type: ignore
        tokenized = [sp_processor.encode(  # type: ignore
            sentence, out_type=str) for sentence in sentences]
        return tokenized

    def get_package_path(self, from_code: str, to_code: str):
        package_path: Path | None = None
        for pack in self.installed_packages:
            if pack.from_code == from_code and pack.to_code == to_code:
                package_path = pack.package_path
        return package_path

    def get_languages(self):
        return self.languages
