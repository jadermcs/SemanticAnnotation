import json

for pole in ["identity", "similarity", "intensity", "polarity"]:
    examples = []
    labels = []
    with open(f"data/{pole}.test.json") as fin:
        data = json.load(fin)
        for example in data:
            label = example["LABEL"]
            if label not in labels:
                labels.append(label)
        for example in data:
            example["OPTIONS"] = labels
            examples.append(example)
    with open(f"data/{pole}.onboarding.json") as fin:
        data = json.load(fin)
        data["data"] = examples
        with open(f"data/{pole}.json", "w") as fout:
            json.dump(data, fout, indent=2)
