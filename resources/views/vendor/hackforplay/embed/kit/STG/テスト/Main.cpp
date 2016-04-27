

#include <fstream>
#include <iostream>
#include <string>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>
#include <boost/optional.hpp>

void main()
{
	using namespace boost::property_tree;

	std::wcout.imbue(std::locale("", std::locale::ctype));

	wptree tree;
	read_json("join.json", tree);

	std::wstring directory, name, result, text;

	if (auto value = tree.get_optional<std::wstring>(L"directory"))
	{
		if (!value.get().empty())
		{
			directory = value.get();
		}
	}

	if (auto value = tree.get_optional<std::wstring>(L"name"))
	{
		if (value.get().empty())
		{
			std::wcout << L"出力するファイル名が不明です" << std::endl;
			std::wcin.get();
			return;
		}
		name = value.get();
	}


	for (auto &child : tree.get_child(L"files"))
	{

		auto source = directory + child.second.get_optional<std::wstring>(L"").get();

		std::wifstream stream(source);

		if (stream.fail())
		{
			std::wcout << L"次のファイルは存在しません: " << source << std::endl;
			continue;
		}

		std::wcout << L">> " << source << std::endl;
		std::wstring text;
		while (std::getline(stream, text))
		{
			result += text + L'\n';
		}

	}

	std::wofstream stream(directory + name);

	stream << result << std::endl;

	std::wcout << L"<< " + directory + name << std::endl;

	std::wcin.get();

}
