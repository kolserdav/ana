from args import Args
from translate import Translate

args = Args()
print(args.update)

translate = Translate(args)

print(translate.translate('Test', 'en', 'ru'))