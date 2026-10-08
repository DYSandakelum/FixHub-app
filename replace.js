const fs = require('fs');
const file = '/Users/kalpanikonara/Desktop/FixHub-app/src/app/(provider)/provider-profile-setup.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');
const newCode = `                    {/* ── Personal Info Card ── */}
                    <View style={styles.proProfileCard}>
                        {/* Header */}
                        <View style={styles.proHeaderRow}>
                            <View style={styles.proIconBox}>
                                <MaterialIcons name="person" size={20} color="#2563EB" />
                            </View>
                            <Text style={styles.proTitle}>PERSONAL INFO</Text>
                            <Text style={styles.basicBadgeText}>Basic</Text>
                        </View>

                        <View style={styles.personalInfoField}>
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="person-outline" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>YOUR NAME</Text>
                                <TextInput
                                    style={styles.fieldValueText}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </View>

                        <View style={styles.personalInfoField}>
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="phone" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>PHONE NUMBER</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                                        <Text style={[styles.fieldValueText, { color: '#4B5563', marginRight: 4 }]}>{countryCode}</Text>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.fieldValueText}
                                        value={phone}
                                        onChangeText={setPhone}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </View>

                        <View style={styles.personalInfoField}>
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="mail-outline" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>EMAIL ADDRESS</Text>
                                <TextInput
                                    style={styles.fieldValueText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </View>
                    </View>`;

lines.splice(89, 146 - 90 + 1, newCode);
fs.writeFileSync(file, lines.join('\n'));
console.log('replaced');
