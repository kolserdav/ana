import ctranslate2
from pathlib import Path


class Lib:
    def get_model_path(self, package_path: Path):
        return f"{package_path}/model"

    def get_translator(self, package_path: Path):
        return ctranslate2.Translator(
            self.get_model_path(package_path=package_path), device="cpu")

    # This model cannot be used as a sequence generator https://opennmt.net/CTranslate2/guides/opennmt_py.html
    @NotImplementedError
    def get_generator(self, package_path: Path):
        return ctranslate2.Generator(self.get_model_path(package_path=package_path), device="cpu")
