KEYSTORE=''
for i in $@;
do
    if [ $index -eq 0 ]; then
      KEYSTORE=$i
    fi
    index=$((index+1))
done
if [ -z $KEYSTORE ]; then
  echo "Keystore path is required"
  echo "Example: ./keystore-fingeprint.sh [KEYSTORE]"
else
keytool -list -v -keystore $KEYSTORE
fi