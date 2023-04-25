from args import Args
import argostranslate.package
import argostranslate.translate


from_code = "en"
to_code = "es"

class Translate:
  args: Args
  def __init__(self, args: Args) -> None:
    self.args = args

    self.install_models()
    
      
  def install_models(self):
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()

    installed_packages = argostranslate.package.get_installed_packages()

    for available_package in available_packages:
      index = -1
      try:
          index = installed_packages.index(available_package)
      except:
        print("Package %s, not found" % (available_package))
      if index == -1 or self.args.update: 
        print(
            "Downloading %s: version %s ..."
            % (available_package, available_package.package_version)
        )
        available_package.install() # type: ignore
  
  def translate(self, text: str, from_code: str, to_code: str):
    return argostranslate.translate.translate(text, from_code, to_code)
